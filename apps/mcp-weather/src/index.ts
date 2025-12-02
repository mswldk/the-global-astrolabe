import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as z from "zod/v4";
import express from "express";
import { fetchWeatherApi } from "openmeteo";

import { WeatherData } from "@repo/types/open-meteo/weather-data";
import { type WeatherCode, getWeatherDescription } from "@repo/types/open-meteo/weather-code";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

const server = new McpServer({
    name: 'weather-mcp-server',
    version: '1.0.0',
});

server.registerTool(
    'get-current-forecast',
    {
        title: 'Get Current Weather forecast',
        description: 'Retrieves the current weather forecast for the specified location.',
        inputSchema: {
            latitude: z.number().describe("The latitude of the coordinates you wish to know the current weather forecast for"),
            longitude: z.number().describe("The longitude of the coordinates you wish to know the current weather forecast for")
        },
        outputSchema: { result: z.object<WeatherData>().nullable() }
    },
    async ({ latitude, longitude }) => {
        const params = {
            latitude: 56,
            longitude: 10,
            current: ["is_day", "weather_code", "temperature_2m", "rain", "showers", "snowfall", "cloud_cover"]
        };

        const responses = await fetchWeatherApi(BASE_URL, params);

        if (responses) {
            const first = responses[0];
            if (first) {
                const current = first.current();
                const utcOffsetSeconds = first.utcOffsetSeconds();
                if (current) {
                    const weatherData: WeatherData = {
                        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                        is_day: current.variables(0)!.value(),
                        weather_code: current.variables(1)!.value(),
                        temperature_2m: current.variables(2)!.value(),
                        rain: current.variables(3)!.value(),
                        showers: current.variables(4)!.value(),
                        snowfall: current.variables(5)!.value(),
                        cloud_cover: current.variables(6)!.value(),
                    };

                    weatherData.weather_code_text = getWeatherDescription(weatherData.weather_code as WeatherCode);

                    const output = { result: weatherData };
                    return {
                        content: [{
                            type: 'text',
                            text: `It is currently the ${weatherData.is_day ? "day" : "night"} time and ${weatherData.weather_code_text} at the location of ${latitude},${longitude}.`
                        }],
                        structuredContent: output
                    };
                }
            }
        }

        // if ((cca2Codes as unknown as Array<string>).includes(countryCode.toLowerCase())) {
        //     const request: Response = await fetch(`${REST_COUNTRIES_BASE_URL}/alpha/${countryCode.toLowerCase()}`);
        //     const result: Array<Country> = request.ok ? await request.json() : null;

        //     if (result) {
        //         const country = result[0];
        //         if (country) {
        //             const output = { result: country };
        //             return {
        //                 content: [{
        //                     type: 'text',
        //                     text: `${country.name.common}'s capital is ${country.capital}.`
        //                 }],
        //                 structuredContent: output
        //             }
        //         }
        //     }
        // }

        return {
            content: [{
                type: "text",
                text: `No forecast found for ${latitude}, ${longitude} yet, but the tool executed successfully.`
            }],
            // structuredContent: { result: undefined }
        };
    }
);


const app = express();
app.use(express.json());

app.use("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const PORT = parseInt(process.env.PORT || '3003');
app.listen(PORT, () => {
    console.log(`[MCP-WEATHER] Server is running on port http://localhost:${PORT}/mcp`);
}).on('error', (error) => {
    console.error(`[MCP-WEATHER] Server error:`, error);
    process.exit(1);
})
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
// import * as z from "zod/v4";
import express from "express";

// import { type Country } from "@repo/types/rest-countries/index";
// import { cca2Codes } from "@repo/data/rest-countries/cca2.codes";

// const REST_COUNTRIES_BASE_URL: string = "https://restcountries.com/v3.1";

const server = new McpServer({
    name: 'nasa-mcp-server',
    version: '1.0.0',
});

// server.registerTool(
//     'get-country-details',
//     {
//         title: 'Get Country Details',
//         description: 'Retrieves geographical and currency information for a given country.',
//         inputSchema: { countryCode: z.string().length(2).describe("The ISO 3166-1 alpha-2 code of the country to get details for.") },
//         outputSchema: { result: z.object<Country>().nullable() }
//     },
//     async ({ countryCode }) => {
//         if ((cca2Codes as unknown as Array<string>).includes(countryCode.toLowerCase())) {
//             const request: Response = await fetch(`${REST_COUNTRIES_BASE_URL}/alpha/${countryCode.toLowerCase()}`);
//             const result: Array<Country> = request.ok ? await request.json() : null;

//             if (result) {
//                 const country = result[0];
//                 if (country) {
//                     const output = { result: country };
//                     return {
//                         content: [{
//                             type: 'text',
//                             text: `${country.name.common}'s capital is ${country.capital}.`
//                         }],
//                         structuredContent: output
//                     }
//                 }
//             }
//         }

//         return {
//             content: [{
//                 type: "text",
//                 text: `No detailed data available for ${countryCode} yet, but the tool executed successfully.`
//             }],
//             structuredContent: { result: undefined }
//         };
//     }
// );


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
    console.log(`[MCP-NASA] Server is running on port http://localhost:${PORT}/mcp`);
}).on('error', (error) => {
    console.error(`[MCP-NASA] Server error:`, error);
    process.exit(1);
})
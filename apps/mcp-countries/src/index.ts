import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as z from "zod/v4";
import express from "express";

const REST_COUNTRIES_BASE_URL: string = "https://restcountries.com/v3.1";

const server = new McpServer({
    name: 'countries-mcp-server',
    version: '1.0.0',
});

server.registerTool(
    'get-country-details', 
    {
        title: 'Get Country Details',
        description: 'Retrieves geographical and currency information for a given country.',
        inputSchema: { countryCode: z.string().length(2).describe("The ISO 3166-1 alpha-2 code of the country to get details for.") },
    },
    async ({ countryCode }) => {
        const request = await fetch(`${REST_COUNTRIES_BASE_URL}/alpha/${countryCode.toLowerCase()}`);
        const result = await request.json();

        console.log(result);

        if (countryCode === "DK") {
            return {
                content: [{
                    type: 'text',
                    text: "The DK's capital is Copenhagen, and its currency is the Danish Krone."
                }]
            }
        }
    
        return {
            content: [{
                type: "text",
                text: `No detailed data available for ${countryCode} yet, but the tool executed successfully.`
            }]
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

const PORT = parseInt(process.env.PORT || '3002');
app.listen(PORT, () => {
    console.log(`[MCP-COUNTRIES] Server is running on port http://localhost:${PORT}/mcp`);
}).on('error', (error) => {
    console.error(`[MCP-COUNTRIES] Server error:`, error);
    process.exit(1);
})
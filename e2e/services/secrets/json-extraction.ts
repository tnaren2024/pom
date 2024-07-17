import { getSecretsUrl } from "../../utils/environment/env-utils";
import { loadEnv } from "./load-env";

interface ISecretsResponse {
    success: boolean;
    data: {
        [key: string]: string;
    };
    message?: string;
}

/**
 * The `jsonExtraction` function fetches secrets data from a specified URL. It uses an Azure DevOps Personal Access Token (PAT)
 * for authentication and retrieves the secrets in JSON format. The function extracts the JSON data from the response,
 * processes it to the desired format, and returns it. If an error occurs during the fetch operation, it handles the error
 * and returns an appropriate message.
 * Steps involved:
 * 1. Retrieve the secrets URL and load environment variables.
 * 2. Check if the Azure DevOps PAT is available in the environment variables.
 * 3. Set up request headers, including the Authorization header with the base64 encoded PAT.
 * 4. Make a fetch request to the URL and handle the response.
 * 5. Parse the JSON response and extract the required data.
 * 6. Handle errors and return the appropriate response.
 * @returns {Promise<ISecretsResponse>} The extracted secrets data or an error message.
 */

export const jsonExtraction = async (): Promise<ISecretsResponse> => {
    const url = getSecretsUrl(); // Get the secrets URL
    loadEnv("e2e/.env"); // Load environment variables from the .env file
    const accessToken = process.env.AZURE_DEVOPS_EXT_PAT; // Get the Azure DevOps PAT from the environment variables

    // Check if the Azure DevOps PAT is available
    if (!accessToken) {
        throw new Error("Azure DevOps PAT not found in environment variables");
    }

    // Encode the PAT in base64 format for use in the Authorization header
    const base64AccessToken = Buffer.from(`:${accessToken}`).toString("base64");

    // Set up request parameters, including headers
    const requestParams = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${base64AccessToken}`
        }
    };

    try {
        // Make a fetch request to the secrets URL
        const response = await fetch(url, requestParams);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // Parse the JSON response
        const jsonData = await response.json();

        // Extract variables and convert to the desired format
        const secretsData: { [key: string]: string } = {};
        const variables = jsonData.variables;

        for (const key in variables) {
            if (variables.hasOwnProperty(key)) {
                secretsData[key] = variables[key].value;
            }
        }

        // Return the success response with extracted data
        return { success: true, data: secretsData };
    } catch (error: any) {
        // Log and return the error response
        console.error(`Failed to fetch secrets: ${error.message}`);
        return { success: false, data: {}, message: error.message };
    }
};

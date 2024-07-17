import { jsonExtraction } from "./json-extraction";

export const AUTOMATION_PASSWORD_KEY = "VNEXT_PASSWORD_HOSTED_ENV";

/**
 * The `getAutomationPassword` function retrieves the password for the automation user by calling the `getSecret` function
 * with a predefined key. This key is used to fetch the corresponding secret value from the secrets service.
 * Steps involved:
 * 1. Define a constant key for the automation password.
 * 2. Call the `getSecret` function with this key to fetch the secret value.
 * 3. Return the secret value.
 * @returns {Promise<string>} The password for the automation user.
 */
export const getAutomationPassword = async (): Promise<string> => {
    return getSecret(AUTOMATION_PASSWORD_KEY);
};

/**
 * The `getSecret` function fetches a secret value from a secrets service using a specified key. It utilizes the `jsonExtraction`
 * function to retrieve the secrets in JSON format. The function processes the response to extract the required secret value.
 * If the fetch operation fails or the key is not found, it throws an appropriate error.
 * Steps involved:
 * 1. Call the `jsonExtraction` function to fetch the secrets.
 * 2. Check if the fetch operation was successful.
 * 3. Extract the secret value corresponding to the provided key from the response.
 * 4. Handle errors if the fetch operation fails or the key is not found.
 * @param {string} key - The key of the secret to be fetched.
 * @returns {Promise<string>} The secret value.
 * @throws Will throw an error if the secrets fetch operation fails or the key is not found.
 */
export const getSecret = async (key: string): Promise<string> => {
    const secrets = await jsonExtraction();

    if (!secrets.success) {
        throw new Error(`Failed to fetch secrets: ${secrets.message}`);
    }
    const secretValue = secrets.data && secrets.data[key];
    if (!secretValue) {
        throw new Error(`Secret key "${key}" not found`);
    }
    return secretValue;
};

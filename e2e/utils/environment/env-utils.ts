import { ITestEnvironment, TestEnvironment, environments } from "./environments";
import { loadEnv } from "../../services/secrets/load-env";

// Constants for defining the getSecretsUrl function
const AZURE_ORG = "O365Exchange";
const AZURE_PROJECT = "Viva Ally";

/**
 * This function returns the test environment based on the env variable TEST_ENVIRONMENT.
 * @returns Test environment (default: dev1)
 */
export const getTestEnvironment = (): TestEnvironment => {
    const env = process.env.TEST_ENVIRONMENT;
    if (!env) {
        return TestEnvironment.DEV;
    }
    return env as TestEnvironment;
};

/**
 * Checks if the test is running in a CI/CD environment.
 * @returns True if the test is running in CI, false otherwise
 */
export const isCI = (): boolean => {
    const ci = process.env.CI;
    if (ci?.toLocaleLowerCase() === "false") {
        return false;
    }
    return !!ci;
};

/**
 * Retrieves the application URL based on the provided or default test environment.
 * @param env (optional) Test environment (default: from env variable TEST_ENVIRONMENT)
 * @returns Application URL
 */
export const getAppUrl = (env?: TestEnvironment): string => {
    return getEnvironmentData(env).appUrl;
};

/**
 * Retrieves environment data based on the provided or default test environment.
 * @param env (optional) Test environment (default: from env variable TEST_ENVIRONMENT)
 * @returns Environment data
 * @throws Error if the provided environment is invalid
 */
export const getEnvironmentData = (env?: TestEnvironment): ITestEnvironment => {
    env ??= getTestEnvironment();
    if (!environments[env]) {
        throw new Error(`Invalid environment value: ${env}`);
    }
    return environments[env];
};

/**
 * Constructs and returns the URL to fetch secrets from Azure DevOps Variable Group.
 * @returns Secrets URL
 */
export const getSecretsUrl = (): string => {
    loadEnv("e2e/.env"); // Load environment variables from .env file

    // Encode the organization, project, and group ID for the Azure DevOps URL
    const org = encodeURIComponent(process.env.AZURE_DEVOPS_ORG || AZURE_ORG);
    const project = encodeURIComponent(process.env.AZURE_DEVOPS_PROJECT || AZURE_PROJECT);
    const groupId = encodeURIComponent(process.env.AZURE_DEVOPS_VARIABLE_GROUP_ID || "921");

    // Construct the URL with encoded parameters
    const url = `https://dev.azure.com/${org}/${project}/_apis/distributedtask/variablegroups/${groupId}?api-version=7.2-preview.1`;

    console.log("Secrets URL:", url); // Log the constructed URL to console

    return url;
};

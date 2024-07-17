/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from "fs";
import * as path from "path";

/**
 * The `loadEnv` function reads environment variables from a specified .env file and loads them into the `process.env` object.
 * This allows for environment-specific configurations to be set up for an application. If no file path is specified,
 * it defaults to loading from a .env file located in the parent directory of the current module's directory.
 * Steps involved:
 * 1. Construct the file path to the .env file using the default or provided path.
 * 2. Read the contents of the .env file synchronously.
 * 3. Split the contents of the file into individual lines.
 * 4. Process each line to extract key-value pairs and set them as environment variables in `process.env`.
 * 5. Handle any errors that occur during the file reading or processing.
 * @param {string} filePath - Path to the .env file. Defaults to ../.env.
 */
function loadEnv(filePath: string = path.join(__dirname, "..", ".env")): void {
    try {
        const envFile = fs.readFileSync(filePath, "utf8");
        const envLines = envFile.split("\n");

        for (const line of envLines) {
            const keyValueArr = line.split("=");
            const key = keyValueArr[0].trim();
            const value = keyValueArr.slice(1).join("=").trim();

            if (key && value && !process.env[key]) {
                process.env[key] = value;
            }
        }
    } catch (error: any) {
        console.error(`Failed to load environment variables from ${filePath}: ${error.message}`);
    }
}

// Example: If .env file is in a different location, provide the path
// loadEnv('/path/to/your/.env');

export { loadEnv };

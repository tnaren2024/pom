/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { ITestData } from "./test-data-types";
import { LogMarker, consoleError, consoleLog } from "../log-handler";
import { getFileFlatList } from "../../utils/file-utils";
import { dirname } from "path";

/**
 * The `getTestData` function reads test data from a specified file. If a reusable data file already exists, it uses that cached data.
 * If not, it reads from the main test data folder and saves the data as reusable if needed. This approach helps in reducing the overhead
 * of reading the same data multiple times and ensures consistency in test data usage across multiple test runs.
 * Steps involved:
 * 1. Check if reusable data file exists.
 * 2. If exists, read and return the data from reusable data file.
 * 3. If not, read the data from the main test data file.
 * 4. Save the read data as reusable if marked as reusable.
 * 5. Return the test data.
 * @param {string} fileName - The test data file name (without extension) relative to resources/test-data folder.
 * @returns {Promise<ITestData>} The test data with actual ids from the JSON file.
 */
export const getTestData = async (fileName: string): Promise<ITestData> => {
    const reusableDataPath = `reusable-data/${fileName}.json`;

    // Check if reusable data file exists
    if (existsSync(reusableDataPath)) {
        consoleLog(LogMarker.NONE, `Found reusable data for ${fileName}, using cached data...`);
        const data = readFileSync(reusableDataPath);
        consoleLog(LogMarker.NONE, `Data from reusable data folder: \n${data.toString()}`);
        return JSON.parse(data.toString());
    }

    // Read data from main test data file if reusable data file doesn't exist
    const testData = await readTestDataFile(fileName);

    // Save the data as reusable if marked as reusable
    if (testData.reusable) {
        const dir = dirname(reusableDataPath);
        mkdirSync(dir, { recursive: true });
        writeFileSync(reusableDataPath, JSON.stringify(testData, null, 2));
    }

    consoleLog(LogMarker.NONE, `Data read from file: \n${JSON.stringify(testData, null, 2)}`);
    return testData;
};

/**
 * The `readTestDataFile` function reads test data from a specified file located in the resources/test-data folder.
 * This function is essential for retrieving test data definitions in JSON format, which are then parsed and used in
 * various test scenarios. The function ensures that the test data is read correctly and transformed into the appropriate
 * format for further processing.
 * @param {string} fileName - The test data file name (without extension) relative to resources/test-data folder.
 * @returns {Promise<ITestData>} The test data definition from JSON file.
 */
export const readTestDataFile = async (fileName: string): Promise<ITestData> => {
    const data = readFileSync(`e2e/resources/test-data/${fileName}.json`);
    const testData: ITestData = JSON.parse(data.toString());
    return testData;
};

/**
 * The `checkTestDataUserNamesUnique` function ensures that all test data files have unique user names to avoid conflicts
 * during test execution. It checks for duplicate user names across all test data files and logs any duplicates found.
 * If duplicates are detected, it stops the execution and prompts the user to fix the conflicts by updating the user names
 * in the test data files.
 * Steps involved:
 * 1. Get a list of all test data files.
 * 2. Read each file and map user names to the files they appear in.
 * 3. Check for duplicate user names across the mapped data.
 * 4. Log any duplicate user names and the files they appear in.
 * 5. Throw an error if duplicates are found to stop execution and prompt for fixing.
 * @returns {Promise<void>} None
 * @throws Will throw an error if duplicate user names are found in the test data files.
 */
export const checkTestDataUserNamesUnique = async () => {
    // Get a list of all test data files
    const files = getFileFlatList("e2e/resources/test-data", [], ".json");
    const userNameMapping = new Map<string, string[]>();

    // Read each file and map user names to the files they appear in
    files.forEach(file => {
        const data = readFileSync(file);
        const testData: ITestData = JSON.parse(data.toString());

        testData.users?.forEach(user => {
            if (!userNameMapping.has(user.name)) {
                userNameMapping.set(user.name, [file]);
            } else {
                userNameMapping.get(user.name)?.push(file);
            }
        });
    });

    // Check for duplicate user names across the mapped data
    const duplicateUsers = [...userNameMapping.entries()].filter(([_key, value]) => value.length > 1);
    if (duplicateUsers.length) {
        // Log any duplicate user names and the files they appear in
        consoleError(LogMarker.NONE, "Duplicate user names found in test data:");
        duplicateUsers.forEach(([key, value]) => {
            consoleError(LogMarker.NONE, `\nUser name - ${key} \nFiles: ${value.join(", ")}\n`);
        });
        consoleError(LogMarker.NONE, "To fix this, update the user names in the test data files!!");
        consoleLog(LogMarker.NONE, "\n");
        // Throw an error if duplicates are found to stop execution and prompt for fixing
        throw new Error("Duplicate user names found in test data!!");
    }
};

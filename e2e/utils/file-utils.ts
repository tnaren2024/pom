/* eslint-disable security/detect-non-literal-fs-filename */
import { lstatSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Recursively traverses all files in the given directory and returns a flat list of files
 * with the specified extension (if provided).
 * @param dir Path to the directory
 * @param result Array to accumulate files found (initially empty)
 * @param fileExt Extension filter (e.g., '.json') - optional
 * @returns Array of file paths matching the extension in the directory
 */
export const getFileFlatList = (dir: string, result: string[], fileExt?: string): string[] => {
    // Synchronously read the directory contents
    readdirSync(dir).forEach(file => {
        const fullPath = join(dir, file);
        if (lstatSync(fullPath).isDirectory()) {
            // Recursively call getFileFlatList for nested directories
            result = getFileFlatList(fullPath, result, fileExt);
        } else if (!fileExt || fullPath.endsWith(fileExt)) {
            // Add file to result if it matches the extension (or no extension is provided)
            result.push(fullPath);
        }
    });
    return result;
};

/**
 * Reads and parses JSON data from a file.
 * @param filePath Path to the JSON file
 * @returns Parsed JSON object
 */
export const readFileData = (filePath: string): any => {
    // Read file synchronously and parse JSON data
    const data = readFileSync(filePath);
    return JSON.parse(data.toString());
};

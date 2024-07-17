/* eslint-disable security/detect-non-literal-fs-filename */
import { dirname } from "path";
import { Actions } from "./playwright/actions";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

/**
 * Save browser cookies to a JSON file for future use.
 * @param action The Actions object used to interact with the browser.
 * @param userEmail The email of the user, used to create a unique file path for the cookies.
 */
export const saveCookies = async (action: Actions, userEmail: string) => {
    const cookies = await action.getCookies();
    if (cookies?.length === 0) {
        return;
    }
    const filePath = `./browsercookies/${userEmail}.json`;
    const dir = dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, JSON.stringify(cookies, null, 2));
};

/**
 * Load and set browser cookies from a JSON file.
 * @param action The Actions object used to interact with the browser.
 * @param userEmail The email of the user, used to locate the cookies file.
 * @returns True if cookies were successfully loaded and set, false otherwise.
 */
export const loadSavedCookies = async (action: Actions, userEmail: string) => {
    const filePath = `browser-cookies/${userEmail}.json`;
    if (!existsSync(filePath)) {
        return false;
    }
    const data = readFileSync(filePath);
    if (!data) {
        return false;
    }
    const cookies = JSON.parse(data.toString());
    if (!cookies?.length || cookies.length === 0) {
        return false;
    }
    await action.setCookies(cookies);
    return true;
};

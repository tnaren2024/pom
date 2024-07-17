import { Locator, Page } from "@playwright/test";
import { IElement, IElementLocator, LocatorType } from "../../types/element";
import { existsSync, readFileSync, writeFileSync } from "fs";

export const getPageElement = (element: IElementLocator, page: Page) => {
    switch (element.locatorType) {
        case LocatorType.ROLE:
            return page.getByRole(element.locator as any);
        case LocatorType.LABEL:
            return page.getByLabel(element.locator);
        case LocatorType.TEXT:
            return page.getByText(element.locator);
        case LocatorType.NAME:
            return page.locator(`[name="${element.locator}"]`);
        default:
            return page.locator(element.locator as string);
    }
};

/**
 * Returns the Playwright locator for the element. If the element has a pageLocator, it will return that.
 * If the locator is not present, it will try the backup locators in order.
 * @param element Element to get the locator for
 * @param page Playwright page
 * @param pageLabel POM page label
 * @returns Playwright locator for the element
 */
export const getPageElementOrBackup = async (element: IElement, page: Page, pageLabel = "", timeout = 5000) => {
    if ((element as any).pageLocator) {
        return (element as any).pageLocator as Locator;
    }
    let elementLocator: IElementLocator | undefined = element.elementLocator;
    let i = 0;
    while (elementLocator && element.backupLocators.length > 0) {
        const isPresent = await isLocatorPresent(getPageElement(elementLocator, page), Math.min(timeout, 5000));
        if (isPresent) {
            if (i > 0) {
                //Record the backups used, so we can fix the main locator to avoid retry every time
                console.log(
                    `[[BackupLocatorUsed]] ${pageLabel} >> ${element.label || element.elementLocator.locator} ;; Backup used: ${elementLocator.locator}`
                );
                writeFallbackLocatorUsed(
                    pageLabel,
                    element.label || element.elementLocator.locator.toString(),
                    elementLocator.locator.toString()
                );
            }
            return getPageElement(elementLocator, page);
        }
        elementLocator = i < element.backupLocators.length ? element.backupLocators[i] : undefined;
        i++;
    }
    return getPageElement(element.elementLocator, page);
};

/**
 * Checks if the Playwright locator is present on the page
 * @param pageElement Playwright locator
 * @param timeout timeout in milliseconds
 * @returns Whether the locator is present on the page
 */
export const isLocatorPresent = async (pageElement: Locator, timeout = 10000) => {
    try {
        await pageElement.waitFor({ state: "attached", timeout: timeout });
    } catch (_e) {
        return false;
    }
    return true;
};

/**
 * Saves the backup locator used to a file. This is used to fix the main locator to avoid retry every time.
 * @param pageLabel Label of the page that the element is on
 * @param elementLabel Element label
 * @param backupLocator The backup locator that is working
 */
const writeFallbackLocatorUsed = (pageLabel: string, elementLabel: string, backupLocator: string) => {
    const fallbackLocatorsFile = "fallback-locators.json";
    const fallbackPresent = existsSync(fallbackLocatorsFile);
    const fallbackLocators = fallbackPresent ? JSON.parse(readFileSync(fallbackLocatorsFile).toString()) : [];
    const isPresent = fallbackLocators.find((fallbackLocator: any) => {
        return fallbackLocator.pageLabel === pageLabel && fallbackLocator.elementLabel === elementLabel;
    });
    if (!isPresent) {
        fallbackLocators.push({ pageLabel, elementLabel, backupLocator });
        writeFileSync(fallbackLocatorsFile, JSON.stringify(fallbackLocators, null, 2));
    }
};

/**
 * Resets the fallback locators file
 */
export const resetFallBackLocators = () => {
    const fallbackLocatorsFile = "fallback-locators.json";
    const fallbackPresent = existsSync(fallbackLocatorsFile);
    if (!fallbackPresent) return;
    writeFileSync(fallbackLocatorsFile, JSON.stringify([], null, 2));
};

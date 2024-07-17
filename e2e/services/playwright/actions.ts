import { Page, expect } from "@playwright/test";
import { IElement } from "../../types/element";
import { getPageElement, getPageElementOrBackup, isLocatorPresent } from "./page_element";
import { ActionLabel, handleElementException } from "../exception-handler";
import { LogMarker, consoleLog, errorLog, startStep } from "../log-handler";

class Actions {
    public page: Page;
    public logLabel: string;
    public testContext: { [key: string]: any } = {};

    constructor(page: Page, logLabel = "") {
        this.page = page;
        this.logLabel = logLabel;
    }

    public setLogLabel(logLabel: string) {
        this.logLabel = logLabel;
    }

    /**
     * Retrieve the text from the clipboard
     */
    public async getClipboardText() {
        const logger = startStep("Get clipboard text", this.logLabel);
        await this.page.context().grantPermissions(["clipboard-read"]);
        const clipboardText = await this.page.evaluate(() => {
            return navigator.clipboard.readText();
        });
        logger.end();
        return clipboardText;
    }

    /**
     * Navigate to the given url
     * @param url url to navigate to
     */
    public async goto(url: string, timeout?: number) {
        const actionMessage = `Go to url ${url}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const params = timeout ? { timeout: timeout } : {};
            await this.page.goto(url, params);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Reload the page
     */
    public async reload() {
        const actionMessage = "Reload page";
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.reload();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Go back to previous page
     */
    public async goBack() {
        const actionMessage = "Go back";
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.goBack();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    public async bringToFront() {
        const actionMessage = "Bring to front";
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.bringToFront();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Get current url loaded in browser
     * @returns url
     */
    public getCurrentUrl() {
        const logger = startStep("Get current URL", this.logLabel);
        const url = this.page.url();
        consoleLog(LogMarker.NONE, `Current URL = ${url}`, this.logLabel);
        logger.end();
        return url;
    }

    /**
     * Wait for the page load event to complete
     * @param timeout timeout in milliseconds
     */
    public async waitForPageLoad(timeout = 20000) {
        const actionMessage = "Wait for page load";
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.waitForLoadState("load", { timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Verify the page title
     * @param title title to assert
     */
    public async assertPageTitle(title: string | RegExp) {
        const actionMessage = `Assert page title. Expected: ${title}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await expect(this.page).toHaveTitle(title);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Click on the given element
     * @param element Element to click
     */
    public async click(element: IElement) {
        const actionMessage = `Click ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.click();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.CLICK, element, this.logLabel);
        }
    }

    /**
     * Click on the given element if present
     * @param element Element to click
     */
    public async clickIfPresent(element: IElement, waitTimeOut = 15000) {
        const actionMessage = `Click if present ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, waitTimeOut);
            if (!(await isLocatorPresent(pageElement, waitTimeOut))) {
                consoleLog(LogMarker.NONE, "Element not present, skip clicking.", this.logLabel);
                logger.end();
            }
            try {
                await pageElement.click();
                logger.end();
            } catch (e) {
                logger.end();
            }
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.CLICK, element, this.logLabel);
        }
    }

    /**
     * Double click on the given element
     * @param element Element to double click
     */
    public async doubleClick(element: IElement) {
        const actionMessage = `Double click ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.dblclick();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.DOUBLE_CLICK, element, this.logLabel);
        }
    }

    /**
     * Right click on the given element
     * @param element Element to right click
     */
    public async rightClick(element: IElement) {
        const actionMessage = `Right click ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.click({ button: "right" });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.RIGHT_CLICK, element, this.logLabel);
        }
    }

    /**
     * Hover on the given element
     * @param element Element to hover
     */
    public async hover(element: IElement) {
        const actionMessage = `Hover ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.hover();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.HOVER, element, this.logLabel);
        }
    }

    /**
     * Focus on the given element
     * @param element Element to focus
     */
    public async focus(element: IElement) {
        const actionMessage = `Focus ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.focus();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.FOCUS, element, this.logLabel);
        }
    }

    /**
     * Input text into the given element
     * @param element Element to input text
     * @param text Text to input
     */
    public async input(element: IElement, text: string) {
        const actionMessage = `Input ${text} into ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.fill(text);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.INPUT, element, this.logLabel);
        }
    }

    /**
     * Input text into the given element by each key stroke
     * @param element Element to input text
     * @param text Text to input
     * @param delay Delay between each key stroke
     */
    public async inputPressSequentially(element: IElement, text: string, delay = 50) {
        const actionMessage = `Input ${text} into ${element.label || element.elementLocator.locator} sequentially`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.pressSequentially(text, { delay: delay });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.INPUT, element, this.logLabel);
        }
    }

    /**
     * Clear the current content of given element
     * @param element Element to clear
     */
    public async clear(element: IElement) {
        const actionMessage = `Clear ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
            await pageElement.clear();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.CLEAR, element, this.logLabel);
        }
    }

    /**
     * Input the text by each key stroke to the given element
     * @param element Element to send keys
     * @param text Text to send
     */
    public async inputStringAsKeysToElement(element: IElement, text: string) {
        const actionMessage = `Send keys ${text} into ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        const keys = text.split("");
        try {
            keys.forEach(async key => {
                consoleLog(LogMarker.NONE, `Pressing key: ${key}`, this.logLabel);
                await pageElement.press(key);
            });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.INPUT, element, this.logLabel);
        }
    }

    /**
     * Send keys to the given element
     * @param element Element to send keys
     * @param keys Keys to send
     */
    public async sendKeysToElement(element: IElement, ...keys: string[]) {
        const actionMessage = `Send keys ${keys} into ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            keys.forEach(async key => {
                consoleLog(LogMarker.NONE, `Pressing key: ${key}`, this.logLabel);
                await pageElement.press(key);
            });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.INPUT, element, this.logLabel);
        }
    }

    /**
     * Send keys to the page
     * @param keys Keys to send
     */
    public async sendKeysToPage(...keys: string[]) {
        const actionMessage = `Send keys ${keys}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            keys.forEach(async key => {
                consoleLog(LogMarker.NONE, `Pressing key: ${key}`, this.logLabel);
                await this.page.keyboard.press(key);
            });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Get text from the given element
     * @param element Element to get text
     * @returns text of the element
     */
    public async getText(element: IElement) {
        const actionMessage = `Get text from ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            const text = await pageElement.innerText();
            logger.end();
            return text;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.GET, element, this.logLabel);
        }
    }

    /**
     * Verify text of the given element
     * @param element Element to verify text
     * @param expectedText Expected text
     */
    public async verifyText(element: IElement, expectedText: string | RegExp) {
        const actionMessage = `Verify text from ${element.label || element.elementLocator.locator}. Expected: ${expectedText}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await expect(pageElement).toHaveText(expectedText);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.GET, element, this.logLabel);
        }
    }

    /**
     * Get attribute value from the given element
     * @param element Element to get attribute
     * @param attributeName Attribute name
     * @returns Attribute value
     */
    public async getAttribute(element: IElement, attributeName: string) {
        const actionMessage = `Get attribute ${attributeName} from ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            const attribute = await pageElement.getAttribute(attributeName);
            logger.end();
            return attribute;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.GET, element, this.logLabel);
        }
    }

    /**
     * Get dimensions of the given element
     * @param element Element to get dimensions
     * @returns Dimensions of the element (x, y, width, height)
     */
    public async getDimensions(element: IElement) {
        const actionMessage = `Get dimensions from ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
            const dimensions = await pageElement.boundingBox();
            logger.end();
            return dimensions;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.GET, element, this.logLabel);
        }
    }

    /**
     * Scroll the given element into the window view
     * @param element Element to scroll into view
     */
    public async scrollElementIntoView(element: IElement) {
        const actionMessage = `Scroll element into view ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            await pageElement.scrollIntoViewIfNeeded();
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            handleElementException(e, ActionLabel.SCROLL_INTO_VIEW, element, this.logLabel);
        }
    }

    /**
     * Vertical Scroll to the end of the page
     */
    public async scrollToEndOfPage() {
        const actionMessage = `Scroll to end of page`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.mouse.wheel(0, 20000);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for the given element to be visible
     * @param element Element to wait for
     * @param timeout timeout in milliseconds
     */
    public async waitForElement(element: IElement, timeout = 15000) {
        const actionMessage = `Wait for element ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
        try {
            await pageElement.waitFor({ state: "visible", timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for nth element to appear. This is useful when there are multiple elements with same locator.
     * @param element Element to wait for
     * @param n position of the element
     * @param timeout timeout in milliseconds
     */
    public async waitForNthElement(element: IElement, n: number, timeout = 15000) {
        const actionMessage = `Wait for element ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
        try {
            await pageElement.nth(n).waitFor({ state: "attached", timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for the given element to be removed from the DOM
     * @param element Element to wait for to disappear
     * @param timeout timeout in milliseconds
     */
    public async waitForElementToDisappear(element: IElement, timeout = 15000) {
        const actionMessage = `Wait for element to disappear ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = getPageElement(element.elementLocator, this.page);
        try {
            await expect(pageElement).toHaveCount(0, { timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for the given element to be disabled
     * @param element Element to wait for to be disabled
     * @param timeout timeout in milliseconds
     */
    public async waitForElementToDisable(element: IElement, timeout = 15000) {
        const actionMessage = `Wait for element to disable ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = getPageElement(element.elementLocator, this.page);
        try {
            await expect(pageElement).toBeDisabled({ timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for the given element to be hidden
     * @param element Element to wait for to be hidden
     * @param timeout timeout in milliseconds
     */
    public async waitForElementToHide(element: IElement, timeout = 15000) {
        const actionMessage = `Wait for element to hide ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = getPageElement(element.elementLocator, this.page);
        try {
            await expect(pageElement).toBeHidden({ timeout: timeout });
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Check if the given element is present
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is present or not
     */
    public async isElementPresent(element: IElement, timeout = 15000, skipBackup?: boolean) {
        const actionMessage = `Is element present ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = skipBackup
                ? getPageElement(element.elementLocator, this.page)
                : await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            try {
                await pageElement.waitFor({ state: "attached", timeout: timeout });
            } catch (_e) {
                logger.end();
                return false;
            }
            logger.end();
            return true;
        } catch (e) {
            logger.end();
            return false;
        }
    }

    /**
     * Check if the given element is visible
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is visible or not
     */
    public async isElementVisible(element: IElement, timeout = 15000) {
        const actionMessage = `Is element visible ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            const isVivible = await pageElement.isVisible();
            logger.end();
            return isVivible;
        } catch (e) {
            logger.end();
            return false;
        }
    }

    /**
     * Check if the given element is checked
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is checked or not
     */
    public async isElementChecked(element: IElement, timeout = 15000) {
        const actionMessage = `Is element checked ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            const checked = await pageElement.isChecked();
            logger.end();
            return checked;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Check if the given element is disabled
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is disabled or not
     */
    public async isElementDisabled(element: IElement, timeout = 15000) {
        const actionMessage = `Is element disabled ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            await pageElement.isDisabled();
            logger.end();
            return true;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Check if the given element is enabled
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is enabled or not
     */
    public async isElementEnabled(element: IElement, timeout = 15000) {
        const actionMessage = `Is element enabled ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            await pageElement.isEnabled();
            logger.end();
            return true;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Check if the given element is editable
     * @param element Element to check
     * @param timeout timeout in milliseconds
     * @returns if the element is editable or not
     */
    public async isElementEditable(element: IElement, timeout = 15000) {
        const actionMessage = `Is element editable ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel, timeout);
            await pageElement.isEditable();
            logger.end();
            return true;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Get count of the given element. This is useful when there are multiple elements with same locator.
     * @param element Element to count
     * @returns Count of the element
     */
    public async getElementsCount(element: IElement): Promise<number> {
        const actionMessage = `Get elements count ${element.label || element.elementLocator.locator}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
            const count = await pageElement.count();
            logger.end();
            return count;
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Perform desired action on all the matching elements. This is useful when there are multiple elements with same locator.
     * @param element Element to perform action on
     * @param action Action that needs to be performed on all the matching elements
     * @param props Properties to be passed to the action
     */
    public async actionOnAllElements(element: IElement, action: (element: any, ...props: any[]) => Promise<void>, ...props: any[]) {
        const actionMessage = `Action on all elements`;
        const logger = startStep(actionMessage, this.logLabel);
        const pageElement = await getPageElementOrBackup(element, this.page, this.logLabel);
        try {
            const pageLocators = await pageElement.all();
            consoleLog(LogMarker.NONE, `Found ${pageLocators.length} elements`, this.logLabel);
            let i = 0;
            for (const pageLocator of pageLocators) {
                await action({ pageLocator: pageLocator, label: `${element.label}_${i}` }, ...props);
                i++;
            }
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Wait for the given time.
     * Avoid using this in tests. Use this for debuggin purpose only.
     * @param timeout timeout in milliseconds
     */
    public async waitForTimeout(timeout: number) {
        const actionMessage = `Wait for timeout ${timeout}`;
        const logger = startStep(actionMessage, this.logLabel);
        try {
            await this.page.waitForTimeout(timeout);
            logger.end();
        } catch (e) {
            errorLog(actionMessage, this.logLabel);
            throw e;
        }
    }

    /**
     * Get cookies of browser
     * @returns cookies
     */
    public async getCookies() {
        const logger = startStep("Get cookies", this.logLabel);
        const cookies = await this.page.context().cookies();
        logger.end();
        return cookies;
    }

    /**
     * Load the given cookies to browser
     * @param cookies cookies to load
     */
    public async setCookies(cookies: any[]) {
        const logger = startStep("Set cookies", this.logLabel);
        await this.page.context().addCookies(cookies);
        logger.end();
    }

    /**
     * Save the screenshot of entire page to playwright-report/custom-screenshots folder
     * @param fileName file name without extension
     */
    public async saveScreenshot(fileName: string) {
        const filePath = `playwright-report/custom-screenshots/${fileName}.png`;
        await this.page.screenshot({ fullPage: true, path: filePath });
    }
}

export { Actions };

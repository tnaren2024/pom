import { Config, chromium } from "@playwright/test";
import { startStep, consoleLog, LogMarker } from "../services/log-handler";
import { resetFallBackLocators } from "../services/playwright/page_element";
import { getAppUrl } from "../utils/environment/env-utils";
import { Actions } from "../services/playwright/actions";
import { MicrosoftLoginPage } from "../pages/login/ms-login-page";

/**
 * The `globalSetup` function is an asynchronous function that is executed before the entire test suite runs.
 * It performs necessary setup actions such as resetting locators, logging the current test environment,
 * and ensuring the application is fully loaded and ready for testing.
 */
export default async function globalSetup(_config: Config) {
    const logger = startStep("Before suite hook");

    resetFallBackLocators();
    consoleLog(LogMarker.NONE, "Performing setup actions before test suite execution...");
    consoleLog(LogMarker.NONE, `Current test environment = ${process.env.TEST_ENVIRONMENT}`);

    await waitForAppLoad();

    logger.end();
}

/**
 * The `waitForAppLoad` function is responsible for ensuring that the application's UI is fully loaded before
 * any tests are executed. It attempts to load the app and verify the presence of a specific element on the
 * Microsoft login page. The function retries this process up to 50 times with a 60-second timeout for each attempt.
 * If the app fails to load after 50 attempts, it throws an error and saves a screenshot for debugging purposes.
 */
const waitForAppLoad = async () => {
    const logger = startStep("Wait for app UI to be loaded");

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const actions = new Actions(page);
    const microsoftLoginPage = new MicrosoftLoginPage(actions);

    let appUp = false;
    let retries = 0;

    while (!appUp && retries < 50) {
        try {
            await actions.goto(getAppUrl(), 60000); // 1 minute
            await actions.waitForElement(microsoftLoginPage.elements.emailInput(), 60000); // 1 minute
            appUp = true;
        } catch (error) {
            await actions.waitForTimeout(60000); // 1 min
            retries += 1;
            consoleLog(LogMarker.NONE, `App is not up, reloading and checking... [attempt: ${retries}]`);
        }

        if (!appUp) {
            await actions.saveScreenshot("intial_app_load");
            throw new Error(`App is not up, tried reloading ${retries} times`);
        }

        await browser.close();
        logger.end();
    }
};

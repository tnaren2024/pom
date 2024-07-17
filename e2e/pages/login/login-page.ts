import { loadSavedCookies, saveCookies } from "../../services/cookie-service"; // Import functions for cookie handling
import { LogMarker, consoleLog, startStep } from "../../services/log-handler"; // Import logging functions
import { Actions } from "../../services/playwright/actions"; // Import Actions class for performing actions on the page
import { IUser } from "../../services/test-data/test-data-types"; // Import IUser interface for user data
import { BasePage } from "../base-page"; // Import BasePage class for common page functionalities
import { MicrosoftLoginPage } from "./ms-login-page"; // Import MicrosoftLoginPage class representing the login page
import { getAppUrl } from "../../utils/environment/env-utils"; // Import utility function to get the app URL

/**
 * The `LoginPage` class extends the `BasePage` class to provide functionalities specific to the login process.
 * It includes methods for logging into the application, utilizing cookies to skip login if available,
 * and saving cookies post login for future use.
 */
export class LoginPage extends BasePage {
    constructor(actions: Actions) {
        super(actions, "MicrosoftLoginPage");
    }

    /**
     * The `loginToGoals` method handles the login process for the application. It first checks if the login can be skipped
     * using saved cookies. If cookies are available and valid, it uses them to bypass the login process.
     * If not, it proceeds with the normal login flow, saves the cookies post login, and ensures the page is fully loaded before proceeding.
     * @param user - The user object containing login credentials and user information
     */
    public async loginToGoals(user: IUser) {
        const logger = startStep(`loginToGoals: ${user.name}`, this.actions.logLabel);

        // Check if we should skip login using cookies based on an environment variable
        const skipLoginUsingCookie = String(process.env.SKIP_COOKIE_LOGIN ?? "false") === "true";
        let isCookiesLoaded = false;

        if (skipLoginUsingCookie) {
            // Log that we are skipping login using cookies
            consoleLog(LogMarker.NONE, "Skipping login using cookie!", this.actions.logLabel);
        } else {
            // Attempt to load saved cookies for the user
            isCookiesLoaded = await loadSavedCookies(this.actions, user.email);
        }

        // Get the application URL
        const url = getAppUrl();

        // Navigate to the application URL with a timeout of 15 seconds
        const navigation = this.actions.goto.bind(this.actions);
        navigation(url, 15000);

        // Create an instance of the Microsoft login page
        const microsoftLoginPage = new MicrosoftLoginPage(this.actions);

        if (isCookiesLoaded) {
            // Log that cookies are present and login is being skipped
            consoleLog(LogMarker.NONE, "Cookies present, skipping login!", this.actions.logLabel);
        } else {
            // Perform user login and wait for the page to fully load
            await microsoftLoginPage.userLogin(user);
            await this.actions.waitForPageLoad();

            // Save cookies for future use
            await saveCookies(this.actions, user.email);
        }

        // End the logging step for the login process
        logger.end();
    }
}

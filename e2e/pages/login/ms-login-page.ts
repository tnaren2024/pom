import { startStep } from "../../services/log-handler";
import { Actions } from "../../services/playwright/actions";
import { IElement, LocatorType } from "../../types/element";
import { BasePage } from "../base-page";
import { IUser } from "../../services/test-data/test-data-types";
import { getAutomationPassword } from "../../services/secrets/secret-service";

/**
 * The `MicrosoftLoginPage` class extends the `BasePage` class and provides functionalities specific to the
 * Microsoft login process. It includes methods to interact with various elements on the login page,
 * such as entering email and password, clicking the submit button, and handling the "Stay signed in" prompt.
 * The class also defines locators for these elements, ensuring robust identification of elements
 * even if their primary locators fail.
 */
export class MicrosoftLoginPage extends BasePage {
    constructor(actions: Actions) {
        super(actions, "MicrosoftLoginPage");
    }

    /**
     * Defines the locators for various elements on the Microsoft login page. Each element includes a primary locator
     * and backup locators to ensure robust identification of elements, even if the primary locator fails.
     */
    public elements = {
        emailInput: (): IElement => {
            return {
                label: "emailInput",
                elementLocator: { locator: "//input[@type='email']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//input[@name='loginfmt']", locatorType: LocatorType.XPATH }]
            };
        },
        passwordInput: (): IElement => {
            return {
                label: "password",
                elementLocator: { locator: "//input[@type='password'][@placeholder]", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//input[@name='passwd'][@placeholder]", locatorType: LocatorType.XPATH }]
            };
        },
        submit: (): IElement => {
            return {
                label: "submit",
                elementLocator: { locator: "//input[@type='submit']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//input[@data-report-event='Signin_Submit']", locatorType: LocatorType.XPATH }]
            };
        },
        useWebApp: (): IElement => {
            return { label: "useWebApp", elementLocator: { locator: ".use-app-lnk", locatorType: LocatorType.CSS }, backupLocators: [] };
        },
        logBackIn: (): IElement => {
            return {
                label: "logBackIn",
                elementLocator: { locator: "//button[normalize-space()='Log back in']", locatorType: LocatorType.XPATH },
                backupLocators: []
            };
        },
        useAnotherAccount: (): IElement => {
            return {
                label: "logBackIn",
                elementLocator: { locator: "//div[normalize-space()='Use another account']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: ".otherTile", locatorType: LocatorType.CSS }]
            };
        },
        staySignedIn: (): IElement => {
            return {
                label: "staySignedIn",
                elementLocator: { locator: "//div[text()='Stay signed in?']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//div[@class='row text-title']", locatorType: LocatorType.XPATH }]
            };
        },
        loginEmailCard: (user: IUser): IElement => {
            return {
                label: "loginEmailCard",
                elementLocator: { locator: "//div[.='" + user.email + "']", locatorType: LocatorType.XPATH },
                backupLocators: []
            };
        },
        progressBar: (): IElement => {
            return {
                label: "progressBar",
                elementLocator: { locator: "#progressBar", locatorType: LocatorType.CSS },
                backupLocators: [
                    {
                        locator: "//div[contains(@class,'lightbox-cover')]/following-sibling::div[@class='progress']",
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        }
    };

    /**
     * Enters the email address into the email input field on the Microsoft login page. This method waits for the
     * email input field to be present, clicks on it, and then inputs the provided email address.
     * @param email - The email address to be entered
     */
    public async enterEmail(email: string) {
        const logger = startStep(`enterEmail: ${email}`, this.actions.logLabel);

        await this.actions.waitForElement(this.elements.emailInput());
        await this.actions.click(this.elements.emailInput());
        await this.actions.input(this.elements.emailInput(), email);

        logger.end();
    }

    /**
     * Enters the password into the password input field on the Microsoft login page. This method waits for the
     * password input field to be present, clicks on it, and then inputs the provided password.
     * @param password - The password to be entered
     */
    public async enterPassword(password: string) {
        const logger = startStep(`enterPassword: ${password}`, this.actions.logLabel);

        await this.actions.waitForElement(this.elements.passwordInput());
        await this.actions.click(this.elements.passwordInput());
        await this.actions.inputPressSequentially(this.elements.passwordInput(), password);

        logger.end();
    }

    /**
     * Clicks on the submit button on the Microsoft login page. This method waits for the submit button to be present,
     * clicks on it, and then waits for the progress bar to appear and disappear to ensure the submission process completes.
     */
    public async clickSubmitButton() {
        const logger = startStep("clickSubmitButton", this.actions.logLabel);
        await this.actions.waitForElement(this.elements.submit());
        await this.actions.click(this.elements.submit());
        try {
            await this.actions.waitForElement(this.elements.progressBar(), 1000);
        } catch (error) {
            // Do nothing
        }
        await this.actions.waitForElementToDisappear(this.elements.progressBar());
        logger.end();
    }

    /**
     * Clicks the "Yes" button on the "Stay signed in" prompt. This method waits for the prompt to appear,
     * clicks the submit button, and then waits for the progress bar to appear and disappear to ensure the action completes.
     */
    public async clickYes_StaySignedIn() {
        const logger = startStep("click Yes on Stay signed in page", this.actions.logLabel);
        await this.actions.waitForElement(this.elements.staySignedIn());
        await this.actions.click(this.elements.submit());

        try {
            await this.actions.waitForElement(this.elements.progressBar(), 1000);
        } catch (error) {
            // Do nothing
        }
        await this.actions.waitForElementToDisappear(this.elements.progressBar());
        logger.end();
    }

    /**
     * Selects the "Stay signed in" option if it is present. This method attempts to click the submit button
     * if it is present on the "Stay signed in" prompt.
     * @returns {Promise<void>}
     */
    public async selectstaySignedInOptions() {
        const logger = startStep("selectstaySignedInOptions", this.actions.logLabel);
        await this.actions.clickIfPresent(this.elements.submit());
        logger.end();
    }

    /**
     * Logs in a user using their email and password. This method performs the entire login process:
     * entering the email, clicking the submit button, entering the password, clicking the submit button again,
     * and handling the "Stay signed in" prompt.
     * @param {IUser} user - The user object containing login credentials and user information
     * @returns {Promise<void>}
     */
    public async userLogin(user: IUser) {
        const logger = startStep(`userlogin: ${user.name}`, this.actions.logLabel);
        const email = user.email;
        const password = process.env.VNEXT_PASSWORD_HOSTED_ENV ?? (await getAutomationPassword());
        await this.enterEmail(email);
        await this.clickSubmitButton();
        await this.enterPassword(password);
        await this.clickSubmitButton();
        await this.clickYes_StaySignedIn();

        logger.end();
    }
}

import { expect } from "@playwright/test";
import { startStep } from "../../services/log-handler";
import { Actions } from "../../services/playwright/actions";
import { getPageElementOrBackup } from "../../services/playwright/page_element";
import { IElement, LocatorType } from "../../types/element";
import { BasePage } from "../base-page";

/**
 * The `HomePage` class extends the `BasePage` class to use the reusable actions.
 * The HomePage class used to handle the Goal List validation.
 * It includes methods for creating Goal List, Selecting Goal List, Checking expected Goal List available.
 */
export class HomePage extends BasePage {
    constructor(actions: Actions) {
        super(actions, "HomePage");
    }
    /**
     * Defines the locators for various elements on the Home page/Goal List page. Each element includes a primary locator
     * and backup locators to ensure robust identification of elements, even if the primary locator fails.
     */
    public elements = {
        welcomeText: (): IElement => {
            return {
                label: "WelcomeText",
                elementLocator: { locator: `//p[@data-testid="welcome-message"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//p[contains(text(),'Welcome to Goals')]", locatorType: LocatorType.XPATH }]
            };
        },
        createGoalListButton: (): IElement => {
            return {
                label: "createGoalListButton",
                elementLocator: { locator: `//button[@data-testid="create-goal-list-button"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//button[text()='Create a goal list']", locatorType: LocatorType.XPATH }]
            };
        },
        goalListNameElements: (goalListName: string): IElement => {
            return {
                label: "goalListNameElements",
                elementLocator: {
                    locator: `//div[@data-testid="allGoalListSection"]//tbody/tr//button/p`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[@data-testid="allGoalListSection"]//tbody/tr/td[1]//button/p[text()='${goalListName}']`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        goalListTemplateSelection: (goalListTemplateName: string): IElement => {
            return {
                label: "goalListTemplateSelection",
                elementLocator: {
                    locator: `//span[text()='${goalListTemplateName}']/ancestor::button`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    { locator: `//span[text()='${goalListTemplateName}']/ancestor::button[@role='tab']`, locatorType: LocatorType.XPATH }
                ]
            };
        },
        useThisTemplate_Button: (): IElement => {
            return {
                label: "useThisTemplate_Button",
                elementLocator: { locator: `//button[text()='Use this template']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//footer/button[text()='Use this template']", locatorType: LocatorType.XPATH }]
            };
        },
        newGoalListNameInput: (): IElement => {
            return {
                label: "newGoalListNameInput",
                elementLocator: {
                    locator: `//div[@data-testid="content-editable" and @data-placeholder="Untitled goal list"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//div[@data-placeholder="Untitled goal list"]`, locatorType: LocatorType.XPATH }]
            };
        },
        goalTableGoalNameInput: (index = 1): IElement => {
            return {
                label: "goalTableGoalNameInput",
                elementLocator: {
                    locator: `//tbody[@data-testid="table-body"]/tr[${index}]/td[2]//div[@data-testid="content-editable"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//tbody/tr[${index}]//div[@data-testid="content-editable"]`, locatorType: LocatorType.XPATH }]
            };
        },
        goalColumnSpinner: (): IElement => {
            return {
                label: "goalColumnSpinner",
                elementLocator: {
                    locator: `//div[text()='Goal']/parent::div/following-sibling::div[@role="progressbar"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `(//div[@role="progressbar"])[1]`, locatorType: LocatorType.XPATH }]
            };
        },
        ownedByYou: (): IElement => {
            return {
                label: "ownedByYou",
                elementLocator: {
                    locator: `//span[text()='Owned by You']/parent::button`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//button[@value="ownedByYou"]`, locatorType: LocatorType.XPATH }]
            };
        }
    };
    /**
     * Object containing names of goal list templates which is used to pass params in goalListTemplateSelection WebElement.
     */
    public goalListTemplateNames = {
        BlankGoalList: "Blank Goal list",
        OKRGoalList: "OKR Goal list",
        SMARTGoalList: "SMART Goal list",
        MetricScorecard: "Metric Scorecard"
    };

    public automationGoalListName = "Automation Goal List";

    /**
     * Waits for the welcome text element to be present on the page.
     */
    public async waitForWelcomeText(timeout = 60000) {
        const logger = startStep(`waitForWelcomeText:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.welcomeText(), timeout);
        logger.end();
    }
    /**
     * Checks if a particular goal list with the specified name is available on the page.
     * @param {string} goalListName - The name of the goal list to check for.
     * @returns {Promise<boolean>} Returns true if the goal list with the specified name is found, otherwise false.
     * @description
     * This method performs the following steps:
     * 1. Retrieves the elements matching the goal list name using `getPageElementOrBackup`.
     * 2. Counts the total number of matching goal list elements.
     * 3. Iterates through each element to check if its text content contains the specified goal list name (case insensitive).
     * 4. Returns true if a matching goal list name is found, otherwise false.
     */
    public async checkParticularGoalListAvailable(goalListName: string): Promise<boolean> {
        const logger = startStep(`checkParticularGoalListAvailable:`, this.actions.logLabel);
        const goalListNames = await getPageElementOrBackup(
            this.elements.goalListNameElements(goalListName),
            this.actions.page,
            this.actions.logLabel
        );
        const totalGoalListCount = await goalListNames.count();
        let goalListNameFound = false;
        for (let i = 0; i < totalGoalListCount; i++) {
            const element = goalListNames.nth(i);
            const elementText = (await element.textContent())!;
            if (elementText.toLowerCase().includes(goalListName.toLowerCase())) {
                goalListNameFound = true;
                break;
            }
        }
        logger.end();
        return goalListNameFound;
    }
    /**
     * Creates a new goal list using a specified template and verifies its creation.
     * @param {string} goalListTemplateName - The name of the template to use for creating the goal list.
     * @param {string} goalListName - The name of the new goal list to be created.
     * @description
     * This method performs the following steps:
     *
     * 2. Clicks the "Use This Template" button to confirm template selection.
     * 3. Inputs the provided goal list name into the corresponding input field.
     * 4. Clicks outside the input field to trigger any necessary actions.
     * 5. Waits for a GraphQL response to ensure the goal list name is updated correctly via API.
     * 6. Verifies that the name retrieved from the API matches the provided goal list name.
     * 7. Inputs a default goal name ("Automation Goal") into the goal table.
     * 8. Clicks outside the input field to trigger any necessary actions.
     * 9. Waits for a spinner element to hide, indicating the completion of the creation process.
     */
    public async createNewGoalListWithDefaultTemplate(goalListTemplateName: string, goalListName: string) {
        const logger = startStep(`createNewGoalList:`, this.actions.logLabel);
        //1. Create Goal List using default templates
        await this.actions.click(this.elements.createGoalListButton());
        await this.actions.click(this.elements.goalListTemplateSelection(goalListTemplateName));
        await this.actions.click(this.elements.useThisTemplate_Button());
        await this.actions.input(this.elements.newGoalListNameInput(), goalListName);
        await this.actions.page.click("body");
        //Verify the goal list is created using network api response
        const goalListNameResponsePromise = this.actions.page.waitForResponse("**/graphql/");
        const goalListNameFromAPI = (await (await goalListNameResponsePromise).json()).data.updateGoalList.data.name;
        expect(goalListNameFromAPI).toEqual(goalListName);
        //Create a goal for the newly created Goal List
        await this.actions.input(this.elements.goalTableGoalNameInput(), "Automation Goal");
        await this.actions.page.click("body");
        //wait for the loader/spinner to close.
        await this.actions.waitForElementToHide(this.elements.goalColumnSpinner());
        logger.end();
    }

    /**
     * Selects a goal list by its name from the list of available goal lists.
     * @param {string} goalListName - The name of the goal list to select.
     * @description
     * This method performs the following steps:
     * 1. Retrieves elements matching the goal list name using `getPageElementOrBackup`.
     * 2. Iterates through each element to find a case-insensitive match with `goalListName`.
     * 3. Clicks on the matching element to select the goal list.
     * 4. Waits for a timeout period (5000 milliseconds) to allow for any necessary page actions.
     */
    public async selectGoalList(goalListName: string) {
        const logger = startStep(`selectGoalList:`, this.actions.logLabel);
        //Getting the list of Goal List available
        const goalListNames = await getPageElementOrBackup(
            this.elements.goalListNameElements(goalListName),
            this.actions.page,
            this.actions.logLabel
        );
        const totalGoalListCount = await goalListNames.count();
        //Iterate through all the element and select the expected Goal List
        for (let i = 0; i < totalGoalListCount; i++) {
            const element = goalListNames.nth(i);
            const elementText = (await element.textContent())!;
            if (elementText.toLowerCase() === goalListName.toLowerCase()) {
                await element.click();
                await this.actions.page.waitForTimeout(5000);
                break;
            }
        }
        logger.end();
    }
    /**
     * Selecting Owned By you tab in home page to select the existing goal list.
     */
    public async openOwnedByYouTab() {
        const logger = startStep(`open OwnedByYou Tab`, this.actions.logLabel);
        await this.actions.click(this.elements.ownedByYou());
        logger.end();
    }

    /**
     * Navigates to the goal list page based on availability of a specific goal list.
     * Creates a new goal list if not available, or selects an existing one.
     */
    public async gotoGoalListPage(goalListName: string) {
        //Checking the expected goal list is available or not
        const isGoalListAvailable = await this.checkParticularGoalListAvailable(goalListName);
        //If goal list is not available then create a new goal list or if available then select the goal list.
        !isGoalListAvailable
            ? await this.createNewGoalListWithDefaultTemplate(this.goalListTemplateNames.BlankGoalList, goalListName)
            : await this.selectGoalList(goalListName);
    }
}

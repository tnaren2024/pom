import { Locator } from "@playwright/test";
import { LogMarker, consoleError, consoleLog, startStep } from "../../services/log-handler";
import { Actions } from "../../services/playwright/actions";
import { IElement, LocatorType } from "../../types/element";
import { BasePage } from "../base-page";
import { getPageElementOrBackup } from "../../services/playwright/page_element";

/**
 * The `CheckInPage` class extends the `BasePage` class to provide reusable actions .
 * It includes gotoGoalCheckInPage, getCheckInNotes.
 */
export class CheckInPage extends BasePage {
    constructor(actions: Actions) {
        super(actions, "CheckInPage");
    }

    public elements = {
        check_In_Notes_Input: (): IElement => {
            return {
                label: "check_In_Notes_Input",
                elementLocator: { locator: "//div[@data-testid='check-in-note-editor']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//div[@aria-label='Update note editor']", locatorType: LocatorType.XPATH }]
            };
        },
        goal_one: (): IElement => {
            return {
                label: "check_In_Notes_Input",
                elementLocator: { locator: "//table/tbody/tr[1]/td[2]/div", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//table/tbody/tr[1]/td[2]", locatorType: LocatorType.XPATH }]
            };
        },
        goal_Check_inMenu: (): IElement => {
            return {
                label: "goal_Check_inMenu",
                elementLocator: { locator: "//div[@role='menu']//a[text()='Check in']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//a[text()='Check in']", locatorType: LocatorType.XPATH }]
            };
        },
        goalTableGoalNameList: (): IElement => {
            return {
                label: "goalTableGoalNameList",
                elementLocator: {
                    locator: `//tbody[@data-testid="table-body"]/tr/td[2]//div[@data-testid="content-editable"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//tbody/tr//div[@data-testid="content-editable"]`, locatorType: LocatorType.XPATH }]
            };
        },
        goalAdditionalOptions: (buttonName: string): IElement => {
            return {
                label: "goalAdditionalOptions",
                elementLocator: { locator: `//button[@aria-label="${buttonName}"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//button[@type="button" and @aria-label="${buttonName}"]`, locatorType: LocatorType.XPATH }]
            };
        }
    };

    /**
     * Retrieves the content of the check-in notes input field as HTML data
     */
    public async getCheckInNoteAsHTML() {
        const logger = startStep(`getCheckInNoteAsHTML:`, this.actions.logLabel);
        const inputElement: Locator = await getPageElementOrBackup(
            this.elements.check_In_Notes_Input(),
            this.actions.page,
            this.actions.logLabel
        );
        logger.end();
        return await inputElement.innerHTML();
    }

    /**
     * Go to Check-in page of given goal name, if goal name is not provided then choose first goal and go to check-in page
     */
    public async gotoGoalCheckInPage(goalName?: string) {
        const goalNames: Locator = await getPageElementOrBackup(
            this.elements.goalTableGoalNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await goalNames.count();
        for (let index = 0; index < count; index++) {
            const element = goalNames.nth(index);
            if (goalName) {
                const elementText = await element.textContent();
                if (elementText?.trim().match(goalName)) {
                    element.hover();
                    await this.actions.click(this.elements.goalAdditionalOptions("Check in"));
                    consoleLog(LogMarker.INFO, "Goal check-in option selected", this.actions.logLabel);
                    break;
                } else if (count - 1 === index) {
                    const conditionFailedMessage = goalName + " goal name is not available in the goal table";
                    consoleError(LogMarker.ERROR, conditionFailedMessage, this.actions.logLabel);
                    throw conditionFailedMessage;
                }
            } else {
                element.hover();
                await this.actions.click(this.elements.goalAdditionalOptions("Check in"));
                break;
            }
        }
    }
}

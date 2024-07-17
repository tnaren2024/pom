import { Locator, expect } from "@playwright/test";
import { LogMarker, consoleError, consoleLog, errorLog, startStep } from "../../services/log-handler";
import { Actions } from "../../services/playwright/actions";
import { IElement, LocatorType } from "../../types/element";
import { BasePage } from "../base-page";
import { getPageElementOrBackup } from "../../services/playwright/page_element";

/**
 * The `CheckInTemplatePage` class extends the `BasePage` class to provide reusable actions .
 * It includes Check-in template create, Edit and Delete with all text formatting,
 * Active/Non active template Modification,
 * Verifying default template is loaded in check-in notes,
 * Maximum allowed template validation
 * Templates order verification after creating templates
 */
export class CheckInTemplatePage extends BasePage {
    constructor(actions: Actions) {
        super(actions, "CheckInTemplatePage");
    }

    public elements = {
        goalList_Settings_ThreeDots: (): IElement => {
            return {
                label: "goalList_Setting_ThreeDots",
                elementLocator: { locator: `//button[@aria-label="More options" and @id="menurfd"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//button[@aria-label="More options"]`, locatorType: LocatorType.XPATH }]
            };
        },
        goalList_Settings_Link: (): IElement => {
            return {
                label: "goalList_Setting_Link",
                elementLocator: { locator: `//a[text()='GoalList Settings']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//div[@role="menuitem"]//a`, locatorType: LocatorType.XPATH }]
            };
        },
        updateTemplateHeader: (): IElement => {
            return {
                label: "updateTemplateHeader",
                elementLocator: { locator: "//p[text()='Update Template']", locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//p[@class='subtitle2' and text()='Update Template']", locatorType: LocatorType.XPATH }]
            };
        },
        templateAddButton: (): IElement => {
            return {
                label: "templateAddButton",
                elementLocator: {
                    locator: `//p[text()='Update Template']/parent::div/following-sibling::div//div[@role="button"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: "", locatorType: LocatorType.XPATH }]
            };
        },
        addTemplateModal: (): IElement => {
            return {
                label: "addTemplateModal",
                elementLocator: { locator: `//div[@role="dialog"]/form`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "", locatorType: LocatorType.XPATH }]
            };
        },
        templateModal_templateName: (): IElement => {
            return {
                label: "templateModal_templateName",
                elementLocator: { locator: `//*[@id="template-name"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "", locatorType: LocatorType.XPATH }]
            };
        },
        templateModal_templateContentInput: (): IElement => {
            return {
                label: "templateModal_templateContentInput",
                elementLocator: { locator: `//*[@ data-testid="roosterEditor"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "", locatorType: LocatorType.XPATH }]
            };
        },
        templateModal_SaveButton: (): IElement => {
            return {
                label: "templateModal_SaveButton",
                elementLocator: { locator: `//div[@role="dialog"]/form//button[text()='Save']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "", locatorType: LocatorType.XPATH }]
            };
        },
        templateModal_CloseButton: (): IElement => {
            return {
                label: "templateModal_CloseButton",
                elementLocator: { locator: `//button[@aria-label="close"]`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: "//div[contains(@class,'fui-DialogTitle__action')]/button", locatorType: LocatorType.XPATH }]
            };
        },
        templateList: (): IElement => {
            return {
                label: "templateList",
                elementLocator: { locator: `//div[@role="group"]`, locatorType: LocatorType.XPATH },
                backupLocators: [
                    {
                        locator: `//p[text()='Update Template']/parent::div/parent::div//following::div[@role="group"]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        templateNameList: (): IElement => {
            return {
                label: "templateNameList",
                elementLocator: {
                    locator: `//div[@role="group"]//div[contains(@class,'fui-CardHeader__header')]/span[contains(@class,'body1')]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[contains(@class,'fui-CardHeader__header')]/span[contains(@class,'body1')]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        templateLockIcon: (templateName: string): IElement => {
            return {
                label: "templateLockIcon",
                elementLocator: {
                    locator: `//div[@role="group"]//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']/parent::div/following-sibling::div/button[@aria-label="Lock Icon"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']/parent::div/following-sibling::div/button[@aria-label="Lock Icon"]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        templateMoreOption: (templateName: string): IElement => {
            return {
                label: "templateMoreOption",
                elementLocator: {
                    locator: `//div[@role="group"]//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']/parent::div/following-sibling::div/button[@aria-label="More options"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']/parent::div/following-sibling::div/button[@aria-label="More options"]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        particularTemplateName: (templateName: string): IElement => {
            return {
                label: "particularTemplateName",
                elementLocator: {
                    locator: `//div[@role="group"]//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        templateEditButton: (): IElement => {
            return {
                label: "templateEditButton",
                elementLocator: { locator: `//label[text()='Edit']//ancestor::div[@role='menuitem']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//div[@role="menuitem"]//label[text()='Edit']`, locatorType: LocatorType.XPATH }]
            };
        },
        templateDeleteButton: (): IElement => {
            return {
                label: "templateDeleteButton",
                elementLocator: { locator: `//label[text()='Delete']//ancestor::div[@role='menuitem']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//div[@role="menuitem"]//label[text()='Delete']`, locatorType: LocatorType.XPATH }]
            };
        },
        template_DeleteModal_DeleteButton: (): IElement => {
            return {
                label: "template_DeleteModal_DeleteButton",
                elementLocator: { locator: `//div[@role="dialog"]//button[text()='Delete']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//div[@role="menuitem"]//label[text()='Delete']`, locatorType: LocatorType.XPATH }]
            };
        },
        templateToggleButton: (): IElement => {
            return {
                label: "templateToggleButton",
                elementLocator: { locator: `//*[@id="switch-ra"]`, locatorType: LocatorType.XPATH },
                backupLocators: [
                    {
                        locator: `//p[text()='Update Template']/following-sibling::div/input[ @id='switch-ra']`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        templateContent_AdditionalOptions: (buttonName: string): IElement => {
            return {
                label: "templateContent_AdditionalOptions_" + buttonName,
                elementLocator: {
                    locator: `//div[@role="menubar"]//div[text()='${buttonName}']/preceding-sibling::button`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//button[@role='menuitem' and @aria-label="${buttonName}"]`, locatorType: LocatorType.XPATH }]
            };
        },
        templateContent_InsertLink_WebAddress_Input: (): IElement => {
            return {
                label: "templateContent_InsertLink_WebAddress_Input",
                elementLocator: {
                    locator: `//div[text()='Web address (URL)']/following-sibling::div//input`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    { locator: `(//div[text()='Web address (URL)']/following::div//input)[1]`, locatorType: LocatorType.XPATH }
                ]
            };
        },
        templateContent_InsertLink_Ok_Button: (): IElement => {
            return {
                label: "templateContent_InsertLink_Ok_Button",
                elementLocator: {
                    locator: `//div[contains(@class,'ms-Modal is-open')]//span[text()='OK']/ancestor::button`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `(//div[contains(@class,'ms-Modal is-open')]//button)[1]`, locatorType: LocatorType.XPATH }]
            };
        },
        templateContent_InsertedLink: (link: string): IElement => {
            return {
                label: "templateContent_InsertedLink",
                elementLocator: { locator: `//div/a[@href='${link}']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//div/a[text()='${link}']`, locatorType: LocatorType.XPATH }]
            };
        },
        templateContent_dropdownOptions: (value: string, dropdownName: string): IElement => {
            return {
                label: "templateContent_" + dropdownName,
                elementLocator: {
                    locator: `//ul[contains(@class,'s-ContextualMenu-list is-open')]/li//span[text()='${value}']`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [{ locator: `//li//span[text()='${value}']`, locatorType: LocatorType.XPATH }]
            };
        },
        templateContent_AddedText: (text: string, tagName: string): IElement => {
            return {
                label: "templateContent_AddedText",
                elementLocator: { locator: `//${tagName}[text()='${text}']`, locatorType: LocatorType.XPATH },
                backupLocators: [{ locator: `//${tagName}[text()='${text}']`, locatorType: LocatorType.XPATH }]
            };
        },
        templateContent_fromTemplateList: (templateName: string): IElement => {
            return {
                label: "templateContent_fromTemplateList",
                elementLocator: {
                    locator: `//span[text()='${templateName}']/ancestor::div[@role="group"]/span`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[@role="group"]//div[contains(@class,'fui-CardHeader__header')]/span[text()='${templateName}']/ancestor::div[@role="group"]/span`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        }
    };

    /**
     * Waits for the update template header to be visible.
     */
    public async waitForUpdateTemplateHeader() {
        const logger = startStep(`waitForUpdateTemplateHeader:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.updateTemplateHeader());
        logger.end();
    }

    /**
     * Navigates to the template setting page by clicking through UI elements.
     */
    public async gotoTemplateSettingPage() {
        await this.actions.click(this.elements.goalList_Settings_ThreeDots());
        await this.actions.click(this.elements.goalList_Settings_Link());
    }

    /**
     * Clicks the 'Add Template' button after scrolling it into view and ensuring it is visible.
     */
    public async clickTemplateAddButton() {
        const logger = startStep(`clickTemplateAddButton:`, this.actions.logLabel);
        await this.actions.scrollElementIntoView(this.elements.templateAddButton());
        await this.actions.waitForElement(this.elements.templateAddButton());
        await this.actions.click(this.elements.templateAddButton());
        logger.end();
    }

    /**
     * Checks if the 'Add Template' modal is displayed by waiting for the update template header to be visible.
     */
    public async isAddTemplateModalDisplayed() {
        const logger = startStep(`isAddTemplateModalDisplayed:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.updateTemplateHeader());
        logger.end();
    }

    /**
     * Validates the new template name by ensuring it follows the expected format,
     * Create new Template with inputs a sample template name and content,
     * and verifies that the new template is displayed in the template list.
     */
    public async validate_NewTemplateName() {
        const logger = startStep(`validate_NewTemplateName:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.templateModal_templateName(), 15000);
        const newTemplateName = await this.actions.getAttribute(this.elements.templateModal_templateName(), "value");
        try {
            const regex = /^Goal Update Template \\d+$/;
            expect(newTemplateName).toMatch(regex);
            consoleLog(LogMarker.INFO, "Template name is displayed as expected format while creating new template", this.actions.logLabel);
        } catch (e) {
            errorLog("New template Name is not displayed as expected", this.actions.logLabel);
            throw e;
        }
        await this.actions.clear(this.elements.templateModal_templateName());
        const sampleTemplateName = "Automation Template";
        await this.actions.input(this.elements.templateModal_templateName(), sampleTemplateName);
        await this.actions.input(this.elements.templateModal_templateContentInput(), "Automation Template Content");
        await this.actions.click(this.elements.templateModal_SaveButton());

        await this.actions.waitForElement(this.elements.particularTemplateName(sampleTemplateName));
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await templateNameList.count();
        for (let index = 0; index < count; index++) {
            const element = templateNameList.nth(index);
            const elementText = await element.textContent();
            if (elementText?.trim().match(sampleTemplateName)) {
                consoleLog(
                    LogMarker.INFO,
                    "New Template is created successfully and is displayed in the template list.",
                    this.actions.logLabel
                );
            } else if (count - 1 === index) {
                const conditionFailedMessage = "Created New Template is not displayed in the template list";
                consoleError(LogMarker.ERROR, conditionFailedMessage, this.actions.logLabel);
                throw conditionFailedMessage;
            }
        }
        logger.end();
    }

    /**
     * Creates a new template with the specified name and content, and verifies that
     * the new template is displayed in the template list.
     * @param {string} templateName - The name of the new template to be created.
     * @param {string} templateContent - The content of the new template to be created.
     * @returns {Promise<string>} - The content of the created template.
     */
    public async create_NewTemplate(templateName: string, templateContent: string): Promise<string> {
        const logger = startStep(`create_NewTemplate:`, this.actions.logLabel);
        await this.clickTemplateAddButton();
        await this.actions.clear(this.elements.templateModal_templateName());
        await this.actions.input(this.elements.templateModal_templateName(), templateName);
        await this.actions.input(this.elements.templateModal_templateContentInput(), templateContent);
        const createTemplateContent = await this.getTemplateContentFromTemplateModal();
        await this.actions.click(this.elements.templateModal_SaveButton());

        await this.actions.waitForElement(this.elements.particularTemplateName(templateName));
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await templateNameList.count();
        for (let index = 0; index < count; index++) {
            const element = templateNameList.nth(index);
            const elementText = await element.textContent();
            if (elementText?.trim().match(templateName)) {
                consoleLog(
                    LogMarker.INFO,
                    "New Template is created successfully and is displayed in the template list.",
                    this.actions.logLabel
                );
            } else if (count - 1 === index) {
                const conditionFailedMessage = "Created New Template is not displayed in the template list";
                consoleError(LogMarker.ERROR, conditionFailedMessage, this.actions.logLabel);
                throw conditionFailedMessage;
            }
        }
        logger.end();
        return createTemplateContent;
    }

    /**
     * Deletes a template with the specified name by clicking on the template's more options,
     * the delete button, and confirming the deletion in the modal.
     * @param {string} templateName - The name of the template to be deleted.
     */
    public async deleteTemplate(templateName: string) {
        const logger = startStep(`deleteTemplate:`, this.actions.logLabel);
        await this.actions.click(this.elements.templateMoreOption(templateName));
        await this.actions.click(this.elements.templateDeleteButton());
        await this.actions.click(this.elements.template_DeleteModal_DeleteButton());
        await this.actions.waitForElementToDisappear(this.elements.particularTemplateName(templateName));
        logger.end();
    }

    /**
     * Checks that a template with the specified name is not available in the template list.
     * @param {string} templateName - The name of the template to check for non-availability.
     */
    public async checkTemplateNotAvailable(templateName: string) {
        const logger = startStep(`checkTemplateNotAvailable:`, this.actions.logLabel);
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await templateNameList.count();
        for (let index = 0; index < count; index++) {
            const element = templateNameList.nth(index);
            const elementText = await element.textContent();
            if (elementText?.trim().match(templateName)) {
                const conditionFailedMessage = "Deleted Template is still displayed in the template list";
                consoleError(LogMarker.ERROR, conditionFailedMessage, this.actions.logLabel);
                throw conditionFailedMessage;
            } else if (count - 1 === index) {
                consoleLog(LogMarker.INFO, "Template " + templateName + " is NOT available in the template list.", this.actions.logLabel);
            }
        }
        logger.end();
    }

    /**
     * Updates the template toggle based on the provided status and verifies the update.
     * @param {boolean} templateStatus - The desired status of the template toggle (true for enabled, false for disabled).
     */
    public async updateTemplateToggleAndVerify(templateStatus: boolean) {
        const toggleButton = this.elements.templateToggleButton();
        await this.actions.isElementPresent(toggleButton);
        await this.actions.scrollElementIntoView(toggleButton);
        const logError = async (message: string) => {
            consoleLog(LogMarker.ERROR, message, this.actions.logLabel);
            throw new Error(message);
        };

        const logInfo = (message: string) => {
            consoleLog(LogMarker.INFO, message, this.actions.logLabel);
        };

        const isChecked = await this.actions.isElementChecked(toggleButton);

        if (templateStatus) {
            if (!isChecked) {
                await this.actions.click(toggleButton);
                const isEnabled = await this.actions.isElementChecked(toggleButton);
                if (isEnabled) {
                    logInfo("Template Toggle Enabled");
                } else {
                    await logError("On clicking template toggle button it is NOT Enabled");
                }
            } else {
                logInfo("Template Toggle is already Enabled");
            }
        } else {
            if (isChecked) {
                await this.actions.click(toggleButton);
                const isDisabled = await this.actions.isElementChecked(toggleButton);
                if (!isDisabled) {
                    logInfo("Template Toggle Disabled");
                } else {
                    await logError("On clicking template toggle button it is NOT Disabled");
                }
            } else {
                logInfo("Template Toggle is already Disabled");
            }
        }
    }

    /**
     * Retrieves the list of template names displayed on the page as an array of strings.
     * @returns {Promise<string[]>} - A promise that resolves with an array of template names.
     */
    public async getTemplateNameListAsArray(): Promise<string[]> {
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await templateNameList.count();
        const templateNames: string[] = [];

        for (let index = 0; index < count; index++) {
            const element = templateNameList.nth(index);
            const elementText = await element.textContent();
            if (elementText) {
                templateNames.push(elementText.trim());
            }
        }
        return templateNames;
    }

    /**
     * Checks if the first template in the list is defaulted by comparing its background color.
     */
    public async checkFirstTemplateIsDefaulted() {
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateList(),
            this.actions.page,
            this.actions.logLabel
        );
        const element = templateNameList.nth(0);
        const firstTemplateBackgroundColor = await element.evaluate((el: HTMLElement) => {
            const color = window.getComputedStyle(el).backgroundColor;
            const rgb = color.match(/\d+/g);
            if (rgb) {
                return `#${((1 << 24) + (parseInt(rgb[0], 10) << 16) + (parseInt(rgb[1], 10) << 8) + parseInt(rgb[2], 10)).toString(16).slice(1).toUpperCase()}`;
            }
            return color;
        });
        const expectedDefaultTemplateBackgroundColor = "#ebebeb";
        expect(firstTemplateBackgroundColor === expectedDefaultTemplateBackgroundColor);
    }

    /**
     * Fills template content with additional options like bold, italic, underline, strikethrough,
     * quotes, numbered lists, bulleted lists, links, font sizes, and headers, and verifies the
     * changes before saving.
     * @param {string} templateName - The name of the template to fill and modify content.
     */
    public async fillTemplateContentWithAdditionalOptions(templateName: string) {
        const logger = startStep(`fillTemplateContentWithAdditionalOptions:`, this.actions.logLabel);
        await this.clickTemplateAddButton();
        await this.actions.clear(this.elements.templateModal_templateName());
        await this.actions.input(this.elements.templateModal_templateName(), templateName);

        const options = ["Bold", "Italic", "Underline", "Strikethrough", "Quote", "Numbered list", "Bulleted list"];
        const additionalOptions = {
            InsertLink: "Insert link",
            RemoveLink: "Remove link",
            Fontsize: "Font size",
            Header: "Header",
            MoreCommands: "More commands"
        };
        const sampleTemplateContent = "This is a sample template content";
        for (let index = 0; index < options.length; index++) {
            await this.actions.click(this.elements.templateContent_AdditionalOptions(options[index]));

            await this.actions.inputPressSequentially(this.elements.templateModal_templateContentInput(), sampleTemplateContent);
            await this.actions.sendKeysToElement(this.elements.templateModal_templateContentInput(), "Enter");
        }
        //insert link
        const sampleLink = "https://microsoft.com";
        await this.insertLinkInTemplateContent(additionalOptions.InsertLink, sampleLink);
        //New line after inserting link
        await this.actions.sendKeysToElement(this.elements.templateModal_templateContentInput(), "Enter");

        //insert link and remove link
        const microsoftLink = "https://microsoft.com/login";
        await this.insertLinkInTemplateContent(additionalOptions.InsertLink, microsoftLink);

        await this.actions.click(this.elements.templateContent_AdditionalOptions(additionalOptions.RemoveLink));
        const isEnteredLinkPresent = await this.actions.isElementPresent(this.elements.templateContent_InsertedLink(microsoftLink));
        expect(isEnteredLinkPresent).toBeFalsy();

        //Text with font size
        await this.actions.sendKeysToElement(this.elements.templateModal_templateContentInput(), "Enter");
        await this.actions.click(this.elements.templateContent_AdditionalOptions(additionalOptions.Fontsize));
        await this.actions.click(this.elements.templateContent_dropdownOptions("16", additionalOptions.Fontsize));
        await this.actions.inputPressSequentially(this.elements.templateModal_templateContentInput(), sampleTemplateContent);

        //Text with Headers
        await this.actions.sendKeysToElement(this.elements.templateModal_templateContentInput(), "Enter");
        await this.actions.click(this.elements.templateContent_AdditionalOptions(additionalOptions.Header));
        await this.actions.click(this.elements.templateContent_dropdownOptions("Header 1", additionalOptions.Header));
        await this.actions.inputPressSequentially(this.elements.templateModal_templateContentInput(), sampleTemplateContent);

        const isAddedTextPresent = this.actions.isElementPresent(this.elements.templateContent_AddedText(sampleTemplateContent, "h1"));
        expect(isAddedTextPresent).toBeTruthy();

        await this.actions.click(this.elements.templateModal_SaveButton());
        logger.end();
    }

    /**
     * Inserts a link into the template content using the provided link input and verifies its presence.
     * @param {string} linkInput - The type of link input (e.g., "Insert link", "Remove link").
     * @param {string} link - The URL link to be inserted.
     */
    public async insertLinkInTemplateContent(linkInput: string, link: string) {
        //Insert link
        await this.actions.click(this.elements.templateContent_AdditionalOptions(linkInput));
        await this.actions.inputPressSequentially(this.elements.templateContent_InsertLink_WebAddress_Input(), link);
        await this.actions.click(this.elements.templateContent_InsertLink_Ok_Button());
        //check Inserted link present in the template content
        const isEnteredLinkPresent = await this.actions.isElementPresent(this.elements.templateContent_InsertedLink(link));
        expect(isEnteredLinkPresent).toBeTruthy();
    }

    /**
     * Retrieves the name of the defaulted template by checking its background color.
     * @returns {Promise<string>} - A promise that resolves with the name of the defaulted template.
     */
    public async getDefaultedTemplateName(): Promise<string> {
        await this.actions.waitForElement(this.elements.templateList());
        const listOfTemplateNamesElement: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const templateList: Locator = await getPageElementOrBackup(this.elements.templateList(), this.actions.page, this.actions.logLabel);
        const count = await templateList.count();
        const expectedDefaultTemplateBackgroundColor = "#ebebeb";
        let defaultedTemplate = "";
        //finding the default template by iterating the available template list
        for (let index = 0; index < count; index++) {
            const element = templateList.nth(index);
            const templateBackgroundColor = await element.evaluate(async (el: HTMLElement) => {
                const color = window.getComputedStyle(el).backgroundColor;
                const rgb = color.match(/\d+/g);
                if (rgb) {
                    return `#${((1 << 24) + (parseInt(rgb[0], 10) << 16) + (parseInt(rgb[1], 10) << 8) + parseInt(rgb[2], 10)).toString(16).slice(1).toUpperCase()}`;
                }
                return color.toLowerCase();
            });
            if (expectedDefaultTemplateBackgroundColor === templateBackgroundColor.toLowerCase()) {
                const templateName = listOfTemplateNamesElement.nth(index);
                defaultedTemplate = (await templateName.textContent())!;
                return defaultedTemplate;
            }
        }
        return "";
    }

    /**
     * Clicks on the more options of a template by its name and then clicks on the edit button to edit it.
     * @param {string} templateName - The name of the template to edit.
     */
    public async editTemplate(templateName: string) {
        const logger = startStep(`editTemplate:`, this.actions.logLabel);
        await this.actions.click(this.elements.templateMoreOption(templateName));
        await this.actions.click(this.elements.templateEditButton());
        logger.end();
    }

    /**
     * Retrieves the content from the template modal's content input field.
     * @returns {Promise<string>} - A promise that resolves with the HTML content of the template modal's content input.
     */
    public async getTemplateContentFromTemplateModal(): Promise<string> {
        const logger = startStep(`getTemplateContentFromTemplateModal:`, this.actions.logLabel);
        const inputElement: Locator = await getPageElementOrBackup(
            this.elements.templateModal_templateContentInput(),
            this.actions.page,
            this.actions.logLabel
        );
        logger.end();
        return await inputElement.innerHTML();
    }

    /**
     * Retrieves the content from the template list for a specific template by its name.
     * @param {string} templateName - The name of the template to retrieve content from.
     * @returns {Promise<string>} - A promise that resolves with the HTML content of the template in the template list.
     */
    public async getTemplateContentInTemplateList(templateName: string): Promise<string> {
        const logger = startStep(`getTemplateContentInTemplateList:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.particularTemplateName(templateName));
        const inputElement: Locator = await getPageElementOrBackup(
            this.elements.templateContent_fromTemplateList(templateName),
            this.actions.page,
            this.actions.logLabel
        );
        logger.end();
        return await inputElement.innerHTML();
    }

    /**
     * Updates the template content by appending text and retrieves the updated content from the template modal.
     * @returns {Promise<string>} - A promise that resolves with the HTML content of the updated template content input.
     */
    public async updateAndGetTemplateContent(): Promise<string> {
        const logger = startStep(`updateAndGetTemplateContent:`, this.actions.logLabel);
        await this.actions.inputPressSequentially(this.elements.templateModal_templateContentInput(), "Edit content from automation.");
        await this.actions.sendKeysToElement(this.elements.templateModal_templateContentInput(), "Enter");
        const inputElement: Locator = await getPageElementOrBackup(
            this.elements.templateModal_templateContentInput(),
            this.actions.page,
            this.actions.logLabel
        );
        logger.end();
        return await inputElement.innerHTML();
    }

    /**
     * Checks if the delete option is not available for the default template.
     */
    public async checkDeleteOptionNotAvailableAndEditOptionAvailableForDefaultTemplate() {
        const logger = startStep(`checkDeleteOptionNotAvailableAndEditOptionAvailableForDefaultTemplate:`, this.actions.logLabel);
        await this.checkDeleteOptionNotAvailableForActiveTemplate();
        logger.end();
    }

    /**
     * Retrieves the list of templates with their respective status (default or not) based on background color.
     * @returns {Promise<{ templateName: string; isTemplateDefault: boolean; }[]>} - A promise that resolves with an array of template objects containing name and default status.
     */
    public async getTemplateListWithStats(): Promise<{ templateName: string; isTemplateDefault: boolean }[]> {
        const logger = startStep(`getTemplateListWithStats:`, this.actions.logLabel);
        await this.actions.waitForElement(this.elements.templateList());
        const listOfTemplateNamesElement: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const templateList: Locator = await getPageElementOrBackup(this.elements.templateList(), this.actions.page, this.actions.logLabel);
        const count = await templateList.count();
        const expectedDefaultTemplateBackgroundColor = "#ebebeb";
        const templateData: { templateName: string; isTemplateDefault: boolean }[] = [];
        for (let index = 0; index < count; index++) {
            const element = templateList.nth(index);
            const templateBackgroundColor = await element.evaluate(async (el: HTMLElement) => {
                const color = window.getComputedStyle(el).backgroundColor;
                const rgb = color.match(/\d+/g);
                if (rgb) {
                    return `#${((1 << 24) + (parseInt(rgb[0], 10) << 16) + (parseInt(rgb[1], 10) << 8) + parseInt(rgb[2], 10)).toString(16).slice(1).toUpperCase()}`;
                }
                return color.toLowerCase();
            });
            const templateNameElement = listOfTemplateNamesElement.nth(index);
            if (expectedDefaultTemplateBackgroundColor === templateBackgroundColor.toLowerCase()) {
                templateData.push({
                    templateName: (await templateNameElement.textContent())!,
                    isTemplateDefault: true
                });
            } else {
                templateData.push({
                    templateName: (await templateNameElement.textContent())!,
                    isTemplateDefault: false
                });
            }
        }
        logger.end();
        return templateData;
    }

    /**
     * Checks if the maximum number of templates can be added by creating templates until reaching the limit.
     * Assumes that no more than 5 templates can be added.
     */
    public async checkMaxNumberOfTemplateAdd() {
        const templateNamesBeforeCreatingNewTemplates = await this.getTemplateNameListAsArray();
        const templateNameList: Locator = await getPageElementOrBackup(
            this.elements.templateNameList(),
            this.actions.page,
            this.actions.logLabel
        );
        const count = await templateNameList.count();
        for (let index = 0; index < 5 - count; index++) {
            const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const templateName = "Automation Template" + randomNumbers;
            const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
            await this.create_NewTemplate(templateName, templateContent);
            templateNamesBeforeCreatingNewTemplates.push(templateName);
        }
        const templateNamesAfterCreatingNewTemplates = await this.getTemplateNameListAsArray();
        expect(templateNamesBeforeCreatingNewTemplates).toEqual(templateNamesAfterCreatingNewTemplates);
        const isAddTemplateOptionsAvailable = await this.actions.isElementPresent(this.elements.templateAddButton());
        expect(isAddTemplateOptionsAvailable).toBeFalsy();
    }

    /**
     * Checks if the delete option is not available for the active template.
     */
    public async checkDeleteOptionNotAvailableForActiveTemplate() {
        const logger = startStep(`checkDeleteOptionNotAvailableForActiveTemplate:`, this.actions.logLabel);
        const getTemplateListWithStats = await this.getTemplateListWithStats();

        const defaultTemplateObj = getTemplateListWithStats.find(x => x.isTemplateDefault);
        const defaultTemplateIndex = getTemplateListWithStats.findIndex(x => x.isTemplateDefault);
        if (defaultTemplateObj) {
            if (defaultTemplateIndex > 1) {
                await this.actions.click(this.elements.templateMoreOption(defaultTemplateObj.templateName));
                const isDeleteOptionAvailableForDefaultTemplate = await this.actions.isElementPresent(this.elements.templateDeleteButton());
                expect(isDeleteOptionAvailableForDefaultTemplate).toBeFalsy();
                const isEditOptionAvailableForDefaultTemplate = await this.actions.isElementPresent(this.elements.templateEditButton());
                expect(isEditOptionAvailableForDefaultTemplate).toBeTruthy();
            } else {
                const isLockOptionNotAvailableForDefaultTemplate = await this.actions.isElementPresent(
                    this.elements.templateLockIcon(defaultTemplateObj.templateName)
                );
                expect(isLockOptionNotAvailableForDefaultTemplate).toBeTruthy();
            }
        }
        logger.end();
    }
    /*
     *Logic implemented in the below method
     *1.  Make sure the goal list have at least 3 template(2 predefined +1 custom(user created))
     * 1a. If only 2 templates available then create 3rd template make that as default
     * 1b. Then check the custom default template should not have delete option, so that it cannot be deleted
     *2.  Change the default template
     *3. Verify the the 3rd template which is previously default one is now having delete option
     */
    public async checkCurrentDefaultTemplateCanBeDeletedOnlyAfterChangingAnotherTemplateAsDefault() {
        const templatesWithStats = await this.getTemplateListWithStats();
        const templateList: Locator = await getPageElementOrBackup(this.elements.templateList(), this.actions.page, this.actions.logLabel);
        const count = await templateList.count();
        let initialDefaultTemplateName = "";
        if (count > 2) {
            const defaultTemplateIndex = templatesWithStats.findIndex(obj => obj.isTemplateDefault);
            defaultTemplateIndex < 2 && (await templateList.nth(count - 1).click()); //Making custom template as default
            initialDefaultTemplateName = templatesWithStats[count - 1].templateName;
            await this.checkDeleteOptionNotAvailableForActiveTemplate(); //verify delete option not available.
        } else {
            for (let index = count; index < 3; index++) {
                //iterate to make sure at least three templates available
                const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
                const templateName = "Automation Template" + randomNumbers;
                const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
                await this.create_NewTemplate(templateName, templateContent);
                //updating the default template
                const templateList: Locator = await getPageElementOrBackup(
                    this.elements.templateList(),
                    this.actions.page,
                    this.actions.logLabel
                );
                await templateList.nth((await templateList.count()) - 1).click();
            }
            this.checkCurrentDefaultTemplateCanBeDeletedOnlyAfterChangingAnotherTemplateAsDefault();
        }
        //change the first template as default template
        await templateList.nth(0).click(); //Making the template as default
        //check previous default template can be deleted now
        const logger = startStep(`check Delete Option Available For Previous Active Template:`, this.actions.logLabel);
        await this.actions.click(this.elements.templateMoreOption(initialDefaultTemplateName!));
        const isDeleteOptionAvailableForDefaultTemplate = await this.actions.isElementPresent(this.elements.templateDeleteButton());
        expect(isDeleteOptionAvailableForDefaultTemplate).toBeTruthy();
        logger.end();
    }

    /**
     * Creates custom templates if fewer than three templates are available, ensuring at least three templates exist.
     *
     * Assumes the existence of a function `create_NewTemplate(templateName: string, templateContent: string)` for template creation.
     */
    public async createCustomTemplateIfNotAvailable() {
        const logger = startStep(`createCustomTemplateIfNotAvailable:`, this.actions.logLabel);
        const templateList: Locator = await getPageElementOrBackup(this.elements.templateList(), this.actions.page, this.actions.logLabel);
        const count = await templateList.count();
        if (count < 3) {
            for (let index = count; index < 3; index++) {
                //iterate to make sure at least three templates available
                const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
                const templateName = "Automation Template" + randomNumbers;
                const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
                await this.create_NewTemplate(templateName, templateContent);
                //updating the default template
                const templateList: Locator = await getPageElementOrBackup(
                    this.elements.templateList(),
                    this.actions.page,
                    this.actions.logLabel
                );
                await templateList.nth((await templateList.count()) - 1).click();
            }
            this.createCustomTemplateIfNotAvailable();
        } else {
            consoleLog(LogMarker.INFO, "Custom Templates available already", this.actions.logLabel);
        }
        logger.end();
    }

    /**
     * Edits a custom template and verifies that the edited content is saved as expected.
     * Assumes the existence of functions `editTemplate(templateName: string)`, `updateAndGetTemplateContent()`, and `getTemplateContentFromTemplateModal()`.
     */
    public async editCustomTemplateAndVerifyEditedContentAreSaveAsExpected() {
        const logger = startStep(`editCustomTemplateAndVerifyEditedContentAreSaveAsExpected:`, this.actions.logLabel);
        const templatesWithStats = await this.getTemplateListWithStats();
        await this.editTemplate(templatesWithStats[templatesWithStats.length].templateName);
        await this.waitForCheckInNoteContentToLoad();

        const templateContentExpectedEditedContent = await this.updateAndGetTemplateContent();
        await this.actions.click(this.elements.templateModal_SaveButton());
        await this.actions.waitForElementToDisappear(this.elements.templateModal_SaveButton());

        await this.editTemplate(templatesWithStats[templatesWithStats.length].templateName);
        await this.waitForCheckInNoteContentToLoad();
        const templateContentActualEditedContent = await this.getTemplateContentFromTemplateModal();

        expect(templateContentExpectedEditedContent).toEqual(templateContentActualEditedContent);
        logger.end();
    }

    /**
     * Discards editing of a custom template and verifies that the edited content is not saved.
     * Assumes the existence of functions `editTemplate(templateName: string)`, `updateAndGetTemplateContent()`, and `getTemplateContentFromTemplateModal()`.
     */
    public async discardEditingCustomTemplateAndVerifyEditedContentAreNOTSaved() {
        const logger = startStep(`discardEditingCustomTemplateAndVerifyEditedContentAreNOTSaved:`, this.actions.logLabel);
        const templatesWithStats = await this.getTemplateListWithStats();
        await this.editTemplate(templatesWithStats[templatesWithStats.length].templateName);
        await this.waitForCheckInNoteContentToLoad();

        const templateContentBefore = await this.getTemplateContentFromTemplateModal();
        const templateContentExpectedEditedContent = await this.updateAndGetTemplateContent();
        await this.actions.click(this.elements.templateModal_CloseButton()); //discarding the edit popup
        await this.actions.waitForElementToDisappear(this.elements.templateModal_CloseButton());

        await this.editTemplate(templatesWithStats[templatesWithStats.length].templateName);
        await this.waitForCheckInNoteContentToLoad();
        const templateContentAfterDiscarded = await this.getTemplateContentFromTemplateModal();

        expect(templateContentBefore).toEqual(templateContentAfterDiscarded);
        expect(templateContentExpectedEditedContent).not.toEqual(templateContentAfterDiscarded);
        logger.end();
    }

    /**
     * Waits for the check-in template content to load.
     * Checks periodically until content is loaded or timeout is reached.
     */
    public async waitForCheckInNoteContentToLoad() {
        let contentLength = 0;
        let count = 0;
        while (!contentLength && count < 15) {
            const noteContent = await this.actions.getText(this.elements.templateModal_templateContentInput());
            if (noteContent && noteContent.trim().length > 0) {
                contentLength = noteContent.trim().length;
            } else {
                consoleLog(LogMarker.INFO, "Waiting for content to load...");
                await this.actions.page.waitForTimeout(1000); //static wait time to check the content again.
                count = count++;
            }
        }
    }
}

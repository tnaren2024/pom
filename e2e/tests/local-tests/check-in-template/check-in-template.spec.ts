import { expect } from "@playwright/test";
import { vTest } from "../../..";
import { CheckInTemplatePage } from "../../../pages/check-in-template/check-in-template-settings-page";
import { HomePage } from "../../../pages/home/home-page";
import { LoginPage } from "../../../pages/login/login-page";
import { Actions } from "../../../services/playwright/actions";
import { getTestData } from "../../../services/test-data/test-data-service";
import { CheckInPage } from "../../../pages/check-in/check-in-page";
import { startStep } from "../../../services/log-handler";

const test = vTest.extend<{ skipBeforeEach: boolean }>({
    skipBeforeEach: [false, { option: true }]
});

test.beforeEach(async ({ actions, skipBeforeEach }) => {
    if (!skipBeforeEach) {
        await loginProcess(actions);
        const homePage = new HomePage(actions);
        await homePage.openOwnedByYouTab();
        await homePage.gotoGoalListPage(homePage.automationGoalListName);
        const checkInTemplatePage = new CheckInTemplatePage(actions);
        await checkInTemplatePage.gotoTemplateSettingPage();
        await checkInTemplatePage.waitForUpdateTemplateHeader();
    }
});

test("@Check-in-template01 Validate whether the default template name with incremental count and default template note are displayed while creating new template. @P0 @SANITY @ADO_4744569", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.clickTemplateAddButton();
    await checkInTemplatePage.validate_NewTemplateName();
});

test("@Check-in-template02 Validate whether Goal list owner can able to create and delete a template and Team members should not have an option to create and delete the template. @P0 @SANITY @ADO_4744581", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    const templateName = "Automation Template" + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
    await checkInTemplatePage.create_NewTemplate(templateName, templateContent);
    await checkInTemplatePage.deleteTemplate(templateName);
    await checkInTemplatePage.checkTemplateNotAvailable(templateName);
});

test("@Check-in-template03 Validate whether Goal list owner can able to enable and disable the template and Team members should not have an option to enable and disable the template. @P0 @SANITY @ADO_4744588", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.updateTemplateToggleAndVerify(false);
    await checkInTemplatePage.updateTemplateToggleAndVerify(true);
});

test("@Check-in-template04 Validate the first default template is enabled by default for the new goal list. @P0 @SANITY @Check-in-template4 @ADO_4744597", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.updateTemplateToggleAndVerify(true);
    await checkInTemplatePage.checkFirstTemplateIsDefaulted();
});

test("@Check-in-template05 Validate whether the template name is displayed in check-in note only when template section is enabled and it should not display when template section is disabled. @P0 @SANITY @ADO_4744600", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    const defaultedTemplateName = await checkInTemplatePage.getDefaultedTemplateName();
    const defaultedTemplateContent = await checkInTemplatePage.getTemplateContentInTemplateList(defaultedTemplateName);

    await actions.goBack();

    const checkInPage = new CheckInPage(actions);
    await checkInPage.gotoGoalCheckInPage();
    //await checkInPage.waitForCheckInNoteContentToLoad();//uncomment this line after Check-in PR is merged
    const goal_Check_in_Notes_Content = await checkInPage.getCheckInNoteAsHTML();
    expect(goal_Check_in_Notes_Content).toEqual(defaultedTemplateContent);
});

test("@Check-in-template06 Validate the created template list are in the order they were created. @P0 @SANITY @Check-in-template6 @ADO_4744604", async ({
    actions
}, testInfo) => {
    testInfo.project.metadata.skipBeforeEach = true;
    //Login steps via common method
    await loginProcess(actions);
    const homePage = new HomePage(actions);
    await homePage.openOwnedByYouTab();
    const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    const goalListName = homePage.automationGoalListName + randomNumbers;
    await homePage.gotoGoalListPage(goalListName);
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.gotoTemplateSettingPage();

    await checkInTemplatePage.waitForUpdateTemplateHeader();
    const templateNamesBeforeCreatingNewTemplates = await checkInTemplatePage.getTemplateNameListAsArray();
    const maximumTemplatesCount = 5;
    const expectedTemplatesToBeCreated = maximumTemplatesCount - templateNamesBeforeCreatingNewTemplates.length;
    for (let index = 0; index < expectedTemplatesToBeCreated; index++) {
        const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const templateName = "Automation Template" + randomNumbers;
        const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
        await checkInTemplatePage.create_NewTemplate(templateName, templateContent);
        templateNamesBeforeCreatingNewTemplates.push(templateName);
    }
    const templateNamesAfterCreatingNewTemplates = await checkInTemplatePage.getTemplateNameListAsArray();
    expect(templateNamesBeforeCreatingNewTemplates).toEqual(templateNamesAfterCreatingNewTemplates);
});

test("@Check-in-template07 @Check-in-template8 Ensures that users can edit, delete templates as needed, with appropriate warnings and restrictions in place. @P0 @SANITY @Check-in-template7 @ADO_4744617", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    const templateName = "Automation Template" + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    const templateContent = "Sample content created via automation !@#$%^&*()_+{}|:{}?><><,.//.,";
    const createdTemplate_Content = await checkInTemplatePage.create_NewTemplate(templateName, templateContent);
    //verify the created template content in edit popup
    await checkInTemplatePage.editTemplate(templateName!);
    const edit_Modal_Created_Template_Content = await checkInTemplatePage.getTemplateContentFromTemplateModal();
    expect(edit_Modal_Created_Template_Content).toEqual(createdTemplate_Content);

    //verify the modified content updated successfully
    const updatedTemplateContent = await checkInTemplatePage.updateAndGetTemplateContent();
    await actions.click(checkInTemplatePage.elements.templateModal_SaveButton());
    await checkInTemplatePage.editTemplate(templateName!);
    const edit_Modal_template_Content = await checkInTemplatePage.getTemplateContentFromTemplateModal();
    expect(edit_Modal_template_Content).toEqual(updatedTemplateContent);
    await actions.click(checkInTemplatePage.elements.templateModal_SaveButton());

    //Discard the modified content and verify template is not updated
    await checkInTemplatePage.editTemplate(templateName!);
    const edit_Modal_template_ContentBeforeEdit = await checkInTemplatePage.getTemplateContentFromTemplateModal();
    await checkInTemplatePage.updateAndGetTemplateContent();
    await actions.click(checkInTemplatePage.elements.templateModal_CloseButton());
    await checkInTemplatePage.editTemplate(templateName!);
    const edit_Modal_template_ContentAfterDiscard = await checkInTemplatePage.getTemplateContentFromTemplateModal();
    expect(edit_Modal_template_ContentAfterDiscard).toEqual(edit_Modal_template_ContentBeforeEdit);
    await actions.click(checkInTemplatePage.elements.templateModal_SaveButton());

    //Delete the created Template
    await checkInTemplatePage.deleteTemplate(templateName);
    await checkInTemplatePage.checkTemplateNotAvailable(templateName);

    //Check delete option is not available for Defaulted template
    await checkInTemplatePage.checkDeleteOptionNotAvailableAndEditOptionAvailableForDefaultTemplate();
});

test("@Check-in-template08 Verifies that after editing a template, the user is able to save the changes or discard them. It ensures that clicking outside the modal popup results in discarding the changes made to the template. And verify text format retains while edit. @P0 @SANITY @ADO_4744619", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.createCustomTemplateIfNotAvailable();
    await checkInTemplatePage.editCustomTemplateAndVerifyEditedContentAreSaveAsExpected();
    await checkInTemplatePage.discardEditingCustomTemplateAndVerifyEditedContentAreNOTSaved();
});

test("@Check-in-template09 Validate the template is created with all additional option in template content @P0 @SANITY ", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    const randomNumbers = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    const templateName = "Automation Template" + randomNumbers;
    await checkInTemplatePage.fillTemplateContentWithAdditionalOptions(templateName);
});

test("@Check-in-template10 verifies that once the active template is switched or templates are disabled, the changes will take effect from the next update started by users for that list. @P0 @SANITY @Check-in-template10 @ADO_4744625", async () => {
    //Development under progress (Auto save check-in notes)
});

test("@Check-in-template11 verifies that when the list owner visits the update section of list settings and disables templates for a specific list, the template list and active template setting are remembered in case templates are re-enabled. It also ensures that users are unable to create, edit, or delete templates until templates are re-enabled. @P0 @SANITY @ADO_4744627", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    //Getting template before switching toggle off
    const templateDataBeforeToggleOff = await checkInTemplatePage.getTemplateListWithStats();
    await checkInTemplatePage.updateTemplateToggleAndVerify(false);

    await checkInTemplatePage.updateTemplateToggleAndVerify(true);

    //Getting template after switching toggle on
    const templateDataAfterToggleOff = await checkInTemplatePage.getTemplateListWithStats();
    const logger = startStep(`Validating Templates data after re-enabling the toggle:`, actions.logLabel);
    expect(templateDataBeforeToggleOff).toEqual(templateDataAfterToggleOff);
    logger.end();
});

test("@Check-in-template12 verifies that when the list owner updates an existing template, the updated template is displayed in the next update initiated. It Ensures that existing updates are not updated and any draft check-ins are not impacted by the change. @P0 @SANITY @ADO_4744630", async () => {
    //Development under progress (Auto save check-in notes)
});

test("@Check-in-template13 verifies that when the list owner attempts to delete the active template, the system prevents the deletion as the active template cannot be deleted. It also ensures that the list owner must switch to another template as active or disable templates before deleting the active template. @P0 @SANITY @ADO_4744631", async ({
    actions
}) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    const logger = startStep(`checkCurrent DefaultTemplate CanBeDeleted OnlyAfterChanging AnotherTemplateAs Default:`, actions.logLabel);
    await checkInTemplatePage.checkCurrentDefaultTemplateCanBeDeletedOnlyAfterChangingAnotherTemplateAsDefault();
    logger.end();
});

test("@Check-in-template14 Verify that goal list can have only 5 templates maximum. @P0 @SANITY @ADO_4744632", async ({ actions }) => {
    const checkInTemplatePage = new CheckInTemplatePage(actions);
    await checkInTemplatePage.checkMaxNumberOfTemplateAdd();
});

/**
 * Initiates the login process using provided actions.
 * @param actions The actions instance for performing interactions.
 */
async function loginProcess(actions: Actions) {
    //Getting test data
    const data = await getTestData("pre-seeded-data");
    const user = data.users && data.users[0];
    const loginPage = new LoginPage(actions);
    //Login with given credentials in test data file
    await loginPage.loginToGoals(user);
    const homePage = new HomePage(actions);
    //Post login wait for the welcome text to appear in the home page.
    await homePage.waitForWelcomeText();
}

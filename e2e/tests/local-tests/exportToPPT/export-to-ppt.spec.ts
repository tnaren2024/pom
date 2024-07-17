import { vTest } from "../../..";
import { ExportToPPT } from "../../../pages/ExportToPPT/export-to-ppt-page";
import { HomePage } from "../../../pages/home/home-page";
import { LoginPage } from "../../../pages/login/login-page";
import { Actions } from "../../../services/playwright/actions";
import { getTestData } from "../../../services/test-data/test-data-service";

vTest(
    "Validate the downloaded PPT with expected Encoded PPT data from API  and verifying the downloaded file type. @P0 @SANITY @ExportToPPT1 @ADO_4704990",
    async ({ actions }) => {
        //log in to the Vnext application with valid credentials
        await loginProcess(actions);
        //Navigate to goal list page
        const homePage = new HomePage(actions);
        await homePage.gotoGoalListPage(homePage.automationGoalListName);

        const exportToPPT = new ExportToPPT(actions);
        await exportToPPT.validateDownloadedPPTWithExpectedDataUsingAPIResponse();
    }
);

vTest("Validate the Export to PPT with expected UI on successful download @P0 @SANITY @ExportToPPT2 @ADO_4704992", async ({ actions }) => {
    //log in to the Vnext application with valid credentials
    await loginProcess(actions);
    //Navigate to goal list page
    const homePage = new HomePage(actions);
    await homePage.gotoGoalListPage(homePage.automationGoalListName);

    const exportToPPT = new ExportToPPT(actions);
    await exportToPPT.checkSuccessMessageOnExportToPPTDownloaded();
});

vTest(
    "Validate the Export to PPT with expected UI on Unsuccessful download during API failure and try again to Export PPT @P0 @SANITY @ExportToPPT3 @ADO_4704993",
    async ({ actions }) => {
        //log in to the Vnext application with valid credentials
        await loginProcess(actions);
        //Navigate to goal list page
        const homePage = new HomePage(actions);
        await homePage.gotoGoalListPage(homePage.automationGoalListName);
        const exportToPPT = new ExportToPPT(actions);
        await exportToPPT.validateExportToPPTDuringAPIFailure();
    }
);

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

import { LogMarker, consoleLog, startStep } from "../../services/log-handler";
import { Actions } from "../../services/playwright/actions";
import { IElement, LocatorType } from "../../types/element";
import { BasePage } from "../base-page";
import fs from "fs";
import { compareByteArrays } from "../../services/export-to-ppt-service";
import { expect } from "@playwright/test";
import { promisify } from "util";

/**
 * The `ExportToPPT` class extends the `BasePage` class to provide functionalities specific to the Exported file validaiton.
 * It includes methods validating downloading the PPT file, encoded file data validation, successful and unsuccessful Modal during api failure and network failure.
 */
export class ExportToPPT extends BasePage {
    constructor(actions: Actions) {
        super(actions, "ExportToPPT");
    }
    /**
     * Defines the locators for various elements on the Goals page particularly for Export to PPT. Each element includes a primary locator
     * and backup locators to ensure robust identification of elements, even if the primary locator fails.
     */
    public elements = {
        ExportDropdown: (): IElement => {
            return {
                label: "ExportDropdown",
                elementLocator: {
                    locator: "//button[text()='Export']",
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//*[@id="menur6v"]/span[contains(@class,"fui-MenuButton__menuIcon")]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        ExportToPPTButton: (): IElement => {
            return {
                label: "ExportToPPTButton",
                elementLocator: {
                    locator: "//*[@role='menuitem']/span[text()='PowerPoint']",
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//span[text()='PowerPoint']`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        ExportToPPTStatusMessagePopup: (popupType: string): IElement => {
            return {
                label: `${popupType} popup`,
                elementLocator: {
                    locator: `//div[@role="dialog"]//div[text()='${popupType}']`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//div[@role="dialog"]//div[text()='${popupType}' or contains(@class,'font-semibold')]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        },
        ExportToPPTStatusPopupButton: (buttonID: string, buttonName: string): IElement => {
            return {
                label: `${buttonName} Button in ExportToPPT StatusPopup`,
                elementLocator: {
                    locator: `//div[@role="dialog"]//button[@data-testid="${buttonID}"]`,
                    locatorType: LocatorType.XPATH
                },
                backupLocators: [
                    {
                        locator: `//button[@data-testid="${buttonID}"]`,
                        locatorType: LocatorType.XPATH
                    }
                ]
            };
        }
    };

    /**
     * Validates the downloaded PPT file against the expected data using an API response.
     * @description
     * This method performs the following steps:
     * 1. Reloads the page and waits for the necessary elements to be loaded.
     * 2. Downloads the PPT file using the "Export to PPT" option.
     * 3. Monitors the network call to capture the API response for the exported file.
     * 4. Saves the downloaded PPT file in the 'e2e' folder.
     * 5. Verifies the downloaded PPT file's byte array against the expected byte array from the API response.
     * 6. Checks the file format to ensure it is a valid PPT file.
     * 7. Deletes the downloaded file after validation is complete.
     */
    public async validateDownloadedPPTWithExpectedDataUsingAPIResponse() {
        const logger = startStep(`ValidateDownloadedPPTWithExpectedData`, this.actions.logLabel);
        await this.actions.reload();
        //Download the PPT using Export option
        await this.actions.waitForElement(this.elements.ExportDropdown(), 60 * 1000);
        await this.actions.page.waitForLoadState("domcontentloaded");
        await this.actions.page.waitForLoadState("networkidle", { timeout: 10000 });
        await this.actions.click(this.elements.ExportDropdown());
        //Tracking particular API's during Export
        await this.actions.click(this.elements.ExportToPPTButton());
        const responsePromise = this.actions.page.waitForResponse("**/graphql/");
        //wait till dowonload event completes
        const [download] = await Promise.all([await this.actions.page.waitForEvent("download")]);
        // Save the exported file in e2e folder with the file name as it is.
        const downloadFolderPath = process.cwd() + "/e2e";
        const downloadedFilePath = `${downloadFolderPath}/${download.suggestedFilename()}`;
        await download.saveAs(downloadedFilePath);
        const expectedFileContentByteArray = JSON.parse((await (await responsePromise).body()).toString()).data.exportGoals.data;
        //verify file format of downloded PPT
        const pptExtensions = [".ppt", ".pptx"];
        const fileExtension = downloadedFilePath.toLowerCase().substring(downloadedFilePath.lastIndexOf("."));
        expect(pptExtensions).toContain(fileExtension);
        //Verify the File content with byte array of downloaded file with Api response which PPT templates are already validated in backend
        await this.comparePPTFileWithAPIResponse(downloadedFilePath, expectedFileContentByteArray);
        await this.deleteFile(downloadedFilePath); //Deleting the downloaded file validation completes.
        logger.end();
    }

    /**
     * Deletes a file at the specified file path.
     * @param {string} filePath - The path to the file which is to be deleted.
     * @description
     * This method deletes a file located at the given file path. It uses the `fs.promises.unlink` method
     * to remove the file from the file system. If the deletion is successful, a log entry is made to indicate
     * success. If an error occurs during deletion, an error log entry is made with the file path and error details.
     * @throws
     * Any errors encountered during file deletion are caught and logged, but not rethrown.
     */
    public async deleteFile(filePath: string) {
        try {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            await fs.promises.unlink(filePath);
            consoleLog(LogMarker.INFO, "Downloaded file deleted successfully after the validation");
        } catch (error) {
            consoleLog(LogMarker.INFO, `Error deleting file ${filePath}: ${error}`);
        }
    }

    /**
     * Compares the byte array of the downloaded PPT file with the expected byte array from the API response.
     * @param {string} downloadedFilePath - The path to the downloaded PPT file.
     * @param {Uint8Array} expectedFileContentByteArray - The expected byte array of the PPT file from the API response.
     * @description
     * This method reads the content of the downloaded PPT file, converts it to a byte array, and compares it with
     * the expected byte array received from the API response. It logs the comparison process and asserts that the
     * byte arrays are equal. If an error occurs during the comparison, it logs the error.
     */
    public async comparePPTFileWithAPIResponse(downloadedFilePath: string, expectedFileContentByteArray: []) {
        try {
            const logger = startStep(`Comparing Downloaded file byte array with API response`, this.actions.logLabel);
            const readFileAsync = promisify(fs.readFile);
            const fileBuffer = await readFileAsync(downloadedFilePath);
            const downloadedFileByteArray = new Uint8Array(fileBuffer);
            const areBuffersEqual = await compareByteArrays(downloadedFileByteArray, new Uint8Array(expectedFileContentByteArray));
            // Assert that the buffers are equal
            expect(areBuffersEqual).toBe(true);
            logger.end();
        } catch (error) {
            consoleLog(LogMarker.ERROR, `Error during comparison: ${error}`);
        }
    }
    /**
     * Checks if the "Export to PPT" button is present on the page, and clicks it.
     */
    public async checkIfExportToPPTButtonPresentAndThenClick(timeout = 60000) {
        const logger = startStep(`CheckIfExportToPPTButtonPresent`, this.actions.logLabel);
        await this.actions.waitForPageLoad(timeout);
        await this.actions.waitForElement(this.elements.ExportDropdown(), timeout);
        await this.actions.click(this.elements.ExportDropdown());
        await this.actions.waitForElement(this.elements.ExportToPPTButton(), timeout);
        await this.actions.click(this.elements.ExportToPPTButton());
        logger.end();
    }
    /**
     * Checks for the success message when the "Export to PPT" process is completed.
     * @description
     * This method performs the following steps:
     * 1. Invokes the method to check if the "Export to PPT" button is present and then clicks it.
     * 2. Checks if the "Exporting your content" popup is displayed to ensure the export process has started.
     * 3. Calls the method to verify that the PPT export process was successful.
     */
    public async checkSuccessMessageOnExportToPPTDownloaded() {
        const logger = startStep(`checkSuccessMessageOnExportToPPTDownloaded`, this.actions.logLabel);
        await this.checkIfExportToPPTButtonPresentAndThenClick();
        const isExportingInprogresPopupDisplayed = await this.actions.isElementPresent(
            this.elements.ExportToPPTStatusMessagePopup("Exporting your content")
        );
        expect(isExportingInprogresPopupDisplayed).toBeTruthy();
        await this.CheckPPTExportSuccessful();
        logger.end();
    }
    /**
     * Checks for the error message when the "Export to PPT" process fails.
     * @description
     * This method performs the following steps:
     * 1. Invokes the method to check if the "Export to PPT" button is present and then clicks it.
     * 2. Checks if the "Export Unsuccessful" error popup is displayed to ensure the export process has failed.
     * 3. Logs a message indicating whether the error popup was displayed or not.
     */
    public async checkErrorMessageOnExportToPPTNotDownloaded() {
        const logger = startStep(`checkErrorMessageOnExportToPPTNotDownloaded`, this.actions.logLabel);
        await this.checkIfExportToPPTButtonPresentAndThenClick();
        const isErrorPopupPresent = await this.actions.isElementPresent(this.elements.ExportToPPTStatusMessagePopup("Export UnSuccessful"));
        if (isErrorPopupPresent) {
            consoleLog(LogMarker.PASS, "Export To PPT failed error message displayed", this.actions.logLabel);
        } else {
            consoleLog(LogMarker.FAIL, "Export To PPT failed error message NOT displayed", this.actions.logLabel);
        }
        logger.end();
    }
    /**
     * Closes the "Export Unsuccessful" popup after an unsuccessful export to PPT attempt.
     */
    public async closeUnSuccessfulExportToPPTPopup() {
        await this.actions.click(this.elements.ExportToPPTStatusPopupButton("closeBtnForError", "Cancel"));
        await this.actions.waitForElementToDisappear(this.elements.ExportToPPTStatusMessagePopup("Export UnSuccessful"));
    }
    /**
     * Retries exporting the PPT and checks if the file is downloaded successfully.
     * @description
     * This method performs the following steps:
     * 1. Clicks the "Try Again" button on the "Export Unsuccessful" popup.
     * 2. Checks if the "Exporting your content" popup is displayed to ensure the export process has restarted.
     * 3. Verifies that the PPT export process was successful.
     */
    public async tryAgainToExportThePPTAndCheckFileDownloadedSuccessfully() {
        const logger = startStep(`tryAgainToExportThePPTAndCheckFileDownloadedSuccessfully`, this.actions.logLabel);
        await this.actions.click(this.elements.ExportToPPTStatusPopupButton("tryAgainBtnForError", "Try Again"));
        const isExportingInprogresPopupDisplayed = await this.actions.isElementPresent(
            this.elements.ExportToPPTStatusMessagePopup("Exporting your content")
        );
        expect(isExportingInprogresPopupDisplayed).toBeTruthy();
        await this.CheckPPTExportSuccessful();
        logger.end();
    }
    /**
     * Checks if the PPT export was successful by waiting for the download to complete and verifying the success message.
     * @description
     * This method performs the following steps:
     * 1. Waits for the "download" event to occur, indicating that the export process has started.
     * 2. Waits for the download to complete and retrieves the download path.
     * 3. Checks if the "Export Complete" success popup is displayed.
     * 4. Logs a message indicating whether the success popup was displayed or not.
     * @throws {Error} If the file fails to download.
     */
    public async CheckPPTExportSuccessful() {
        const [download] = await Promise.all([await this.actions.page.waitForEvent("download", { timeout: 1000 * 120 })]);
        // Wait for the download to complete and get the path
        const downloadPath = await download.path();
        if (!downloadPath) {
            throw new Error("Failed to download the file");
        }
        const isSuccessPopupPresent = await this.actions.isElementPresent(this.elements.ExportToPPTStatusMessagePopup("Export Complete"));
        if (isSuccessPopupPresent) {
            consoleLog(LogMarker.PASS, "Export To PPT success Message displayed", this.actions.logLabel);
        } else {
            consoleLog(LogMarker.FAIL, "Export To PPT success Message NOT displayed", this.actions.logLabel);
        }
    }
    // Function to simulate network disable
    public async disableNetwork() {
        await this.actions.page.route("**/graphql/", route => route.abort());
    }

    // Function to simulate network enable
    public async enableNetwork() {
        await this.actions.page.unroute("**/graphql/");
    }

    /**
     * Validates the "Export to PPT" functionality during API failure scenarios.
     * @description
     * This method performs the following steps:
     * 1. Disables the network to simulate API failure.
     * 2. Checks for the error message when attempting to export to PPT.
     * 3. Enables the network to restore normal operation.
     * 4. Closes the "Export Unsuccessful" popup if it appears.
     * 5. Reloads the page and waits for the "Export" dropdown element to be available.
     * 6. Disables the network again to simulate API failure during retry.
     * 7. Checks for the error message when attempting to export to PPT after retry.
     * 8. Enables the network to restore normal operation.
     * 9. Retries exporting the PPT and checks if the file is downloaded successfully.
     */
    public async validateExportToPPTDuringAPIFailure() {
        await this.disableNetwork();
        await this.checkErrorMessageOnExportToPPTNotDownloaded();

        await this.enableNetwork();
        await this.closeUnSuccessfulExportToPPTPopup();

        //Validate the try again functionality that export is working fine
        await this.actions.page.reload();
        await this.actions.waitForElement(this.elements.ExportDropdown(), 60 * 1000);

        await this.disableNetwork();
        await this.checkErrorMessageOnExportToPPTNotDownloaded();

        await this.enableNetwork();
        await this.tryAgainToExportThePPTAndCheckFileDownloadedSuccessfully();
    }
}

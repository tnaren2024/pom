import { test, expect } from "@playwright/test";
import consumerFromData from "../../data/consumerFromData.json";
import HomePage from "../../pages/commonPage/homePage.js";
import ConsumerRegistionPage from "../../pages/consumerPage/consumerPage.js";
import { CONSUMER_RESGISTRATION_URL } from "../../data/Constant/constent.js";

test.describe("Consumer Details and Registration Page Validation", () => {
  let page;
  let homePage;
  let consumerRegistionPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("https://hyperdrive-dev.aexp.com/");
    homePage = new HomePage(page);
    await homePage.login("babu", "Hyperdrive@UI@5814");
    await page.waitForLoadState("domcontentloaded");
  });

  async function navigateToConsumerRegistration() {
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    consumerRegistionPage = new ConsumerRegistionPage(page);
  }

  consumerFromData.forEach(({ description, data, expected }) => {
    test(description, async () => {
      const randomSuffix = Math.floor(Math.random() * 1000 + 1);
      await navigateToConsumerRegistration();
      
      await consumerRegistionPage.registerNewConsumer(
        `${data.name}${randomSuffix}`,
        data.description,
        data.readWriteGroup,
        data.emailDlAddress
      );

      await page.waitForTimeout(2000);
      await validateConsumerRegistration(expected.validationType);
    });
  });

  async function validateConsumerRegistration(validationType) {
    const validationMessages = {
      success: () => expect.soft(page).toHaveURL("https://hyperdrive-dev.aexp.com/consumer/dashboard/addparticipant"),
      "Name is too long": async () => validateErrorMessage(consumerRegistionPage.getLongConsumerNameError(), "Name is too long"),
      "Description is too long": async () => expect.soft(await consumerRegistionPage.getLongDescriptionError()).toContain("Description is too long"),
      "Email should be @aexp.com": async () => expect.soft(await consumerRegistionPage.getInvalidEmailError()).toContain("Email should be @aexp.com"),
      "Invalid IIQ Group": async () => expect.soft(await consumerRegistionPage.getInvalidIIQGroupError()).toContain("Invalid IIQ Group"),
      "Group ID not found in IIQ": async () => expect.soft(await consumerRegistionPage.getInvalidIIQGroupError()).toContain("Group ID not found in IIQ."),
      "Value cannot be empty": async () => expect.soft(await consumerRegistionPage.getValueCannotBeEmptyError()).toContain("The value cannot be empty."),
    };

    if (validationMessages[validationType]) {
      await validationMessages[validationType]();
    } else {
      throw new Error(`Unhandled validation type: ${validationType}`);
    }
  }

  async function validateErrorMessage(actualMessagePromise, expectedMessage) {
    const actualMessage = await actualMessagePromise;
    console.log("Actual message:", actualMessage);
    await expect.soft(actualMessage).toContain(expectedMessage);
  }

  test("Verify user action menu", async () => {
    await homePage.profile();
    await homePage.userActionMenuButtonVisiable();
  });

  test("Verify Registration Page URLs", async () => {
    await homePage.profile();
    await homePage.clickEdit();

    const expectedUrls = Object.values(CONSUMER_RESGISTRATION_URL);
    const selectors = [
      consumerRegistionPage.hyperdriveDoc_Loc,
      consumerRegistionPage.iiqDoc_Loc,
      consumerRegistionPage.iiqDoc_Loc2,
      consumerRegistionPage.readWriteUrl_Loc,
      consumerRegistionPage.readOnlyUrl_Loc1,
      consumerRegistionPage.emailDistributionUrl_Loc,
    ];

    const urls = await homePage.docsCaptureLinks(selectors);
    urls.forEach((url, index) => {
      await expect.soft(url).toBe(expectedUrls[index]);
    });
  });

  test("Verify disabled validate buttons before consumer registration", async () => {
    await navigateToConsumerRegistration();
    
    const count = await consumerRegistionPage.validatebtn_Loc.count();
    console.log("Total number of disabled validate buttons:", count);

    for (let i = 0; i < count; i++) {
      await expect.soft(consumerRegistionPage.validatebtn_Loc.nth(i)).toBeDisabled();
    }
    await expect.soft(consumerRegistionPage.submitBtnLocator).toBeDisabled();
  });

  test("Verify empty name input", async () => {
    await navigateToConsumerRegistration();
    await validateInputAndExpectError("  ", consumerRegistionPage.valueCannotBeEmptyError);
  });

  async function validateInputAndExpectError(inputValue, errorMessageLocator) {
    await consumerRegistionPage.consumerName.fill(inputValue);
    await consumerRegistionPage.nameValidateBtn.click();
    await expect.soft(errorMessageLocator).toBeVisible();
  }

  test.afterEach(async () => {
    await homePage.quit();
  });
});
========================================================================

  import { expect } from "@playwright/test";

class ConsumerRegistionPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.locators = {
      consumerName: page.locator("#name"),
      nameValidateBtn: page.locator("//input[@id='name']//following-sibling::button"),
      readWriteGroup: page.locator("#readWriteGroup"),
      readWriteGroupValidateBtn: page.locator("//input[@id='readWriteGroup']//following-sibling::button"),
      description: page.locator("#description"),
      emailDlAddress: page.locator("#emailDlAddress"),
      cancelBtn: page.locator('[data-testid="cancelBtn"]'),
      submitBtn: page.locator('[data-testid="submitBtn"]'),
      longConsumerNameError: page.locator('//span[text()="Name is too long"]'),
      longDescriptionError: page.locator('//span[text()="Description is too long"]'),
      invalidIIQGroupError: page.locator('//div/span[text()="Group ID not found in IIQ."]'),
      invalidEmailError: page.locator('//div/span[text()="Email should be @aexp.com"]'),
      valueCannotBeEmptyError: page.locator('//span[text()="The value cannot be empty."]'),
      consumerHeader: page.locator('//h4[normalize-space()="Consumer Dashboard"]'),
      section3: page.locator('[data-testid="section3"]')
    };
  }

  async registerNewConsumer(name, description, readWriteGroup, emailDlAddress) {
    await this.fillConsumerDetails(name, description, readWriteGroup, emailDlAddress);
    await this.locators.section3.click();
    await this.page.waitForTimeout(1000);
  }

  async fillConsumerDetails(name, description, readWriteGroup, emailDlAddress) {
    await this.locators.consumerName.fill(name);
    await this.locators.nameValidateBtn.click();
    await this.locators.description.fill(description);
    await this.page.waitForTimeout(1000);
    await this.locators.readWriteGroup.fill(readWriteGroup);
    await this.locators.readWriteGroupValidateBtn.click();
    await this.page.waitForTimeout(1000);
    await this.locators.emailDlAddress.fill(emailDlAddress);
  }

  async clickSubmit() {
    await this.locators.submitBtn.click();
  }

  async clickCancel() {
    await this.locators.cancelBtn.click();
  }

  async getErrorMessage(locator) {
    await this.page.waitForSelector(locator);
    return await this.page.locator(locator).innerText();
  }

  async getLongConsumerNameError() {
    return await this.getErrorMessage('//span[text()="Name is too long"]');
  }

  async getLongDescriptionError() {
    return await this.getErrorMessage('//span[text()="Description is too long"]');
  }

  async getInvalidEmailError() {
    return await this.getErrorMessage('//div/span[text()="Email should be @aexp.com"]');
  }

  async getInvalidIIQGroupError() {
    return await this.getErrorMessage('//div/span[text()="Group ID not found in IIQ."]');
  }

  async getValueCannotBeEmptyError() {
    return await this.getErrorMessage('//span[text()="The value cannot be empty."]');
  }

  async expectConsumerHeaderToBeVisible() {
    await expect(this.locators.consumerHeader).toBeVisible();
    await expect(this.locators.consumerHeader).toContainText("Consumer Dashboard");
  }

  async getRegistrationParagraphText(selectors) {
    return await Promise.all(selectors.map(selector => selector.innerText()));
  }
}

export default ConsumerRegistionPage;

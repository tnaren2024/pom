import { test, expect, page, webkit, locator } from "@playwright/test";
import consumerFromData from "../../data/consumerFromData.json";
import HomePage from "../../pages/commonPage/homePage.js";
import { CONSUMER_RESGISTRATION_URL, CONSUMER_RESGISTRATION_TEXT } from "../../data/Constant/constent.js";
import ConsumerRegistionPage from "../../pages/consumerPage/consumerPage.js";
import ENV from "../../utils/env.js";

test.describe("Consumer Details and Registration page validation", () => {
  let page;
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("https://hyperdrive-dev.aexp.com/");
    const homePage = new HomePage(page);
    await homePage.login("babu", "Hyperdrive@UI@5814");
    await page.waitForLoadState("domcontentloaded");
  });

  consumerFromData.forEach(({ description, data, expected }) => {
    test(description, async () => {
      let x = Math.floor(Math.random() * 1000 + 1);
      const homePage = new HomePage(page);
      await homePage.profile();
      await homePage.selectConsumer();
      await homePage.addnewRegistration();
      const consumerRegistionPage = new ConsumerRegistionPage(page);
      await consumerRegistionPage.registernewConsumer(
        data.name + x,
        data.discription,
        data.readWriteGroup,
        data.emailDlAddress
      );
      await page.waitForTimeout(2000);
      switch (expected.validationType) {
        case "success":
          await expect
            .soft(page)
            .toHaveURL(
              "https://hyperdrive-dev.aexp.com/consumer/dashboard/addparticipant"
            );
          break;

        case "Name is too long":
          console.log(
            "Print the value of long consumer name: ",
            await consumerRegistionPage.getTxtlongConsumer()
          );
          await expect
            .soft(await consumerRegistionPage.getTxtlongConsumer())
            .toContain("Name is too long");
          break;

        case "The value cannot be empty.":
          console.log(
            "Print the value of long consumer name: ",
            await consumerRegistionPage.getTxtlongConsumer()
          );
          await expect
            .soft(await consumerRegistionPage.getTxtlongConsumer())
            .toContain("Name is too long");

          break;

        case "Description is too long":
          await expect
            .soft(await consumerRegistionPage.getTxtlongDescription())
            .toContain("Description is too long");
          break;
        case "consumer name The value cannot be empty.":
          console.log(
            "Print the value of long consumer name: ",
            await consumerRegistionPage.getTxtlongConsumer()
          );
          await expect
            .soft(await consumerRegistionPage.getTxtlongConsumer())
            .toContain("The value cannot be empty.");
          break;

        case "Email should be @aexp.com":
          await expect
            .soft(await consumerRegistionPage.getTxtInvalidEmail())
            .toContain("Email should be @aexp.com");
          break;

        case "Invalid IIQ Group":
          await expect
            .soft(await consumerRegistionPage.getTxtInvalidReadWrite())
            .toContain("Invalid IIQ Group");
          break;

        case "Group ID not found in IIQ":
          await expect
            .soft(await consumerRegistionPage.getTxtInvalidReadWrite())
            .toContain("Group ID not found in IIQ.");
          break;

        case "Value cannot be empty":
          await expect
            .soft(await consumerRegistionPage.getTxtValuecannotBeEmpty())
            .toContain("The value cannot be empty.");
          break;
        default:
          throw new Error(
            `Unhandled validation type: ${expected.validationType}`
          );
      }
    });
  });

  test("Verified user action menu", async () => {
    const homePage = new HomePage(page);
    await homePage.profile();
    await homePage.userActionMenuButtonVisiable();
  });

  test("Verified Registion page Url", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.clickEdit();
    const expectedUrl = [
      CONSUMER_RESGISTRATION_URL.RESGISTRATION_IIQ_DOCS,
      CONSUMER_RESGISTRATION_URL.READ_WRIGHT_GROUP_DOCS,
      CONSUMER_RESGISTRATION_URL.READ_ONLY_GROUP_DOCS,
      CONSUMER_RESGISTRATION_URL.EMAIL_DISTRIBUTION_DOCS,
    ];
    const selectors = [
      consumerRegistionPage.hyperdriveDoc_Loc,
      consumerRegistionPage.iiqDoc_Loc,
      consumerRegistionPage.iiqDoc_Loc2,
      consumerRegistionPage.readWriteUrl_Loc,
      consumerRegistionPage.readOnlyUrl_Loc1,
      consumerRegistionPage.emailDistributionUrl_Loc,
    ];
    const urls = await homePage.docsCaptureLinks(selectors);
    for (let i = 0; i < urls.length; i++) {
      await expect.soft(urls[i]).toBe(urls[i]);
    }
  });
  test("Verified validate buttons before consumer regisatraion", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    const count = await consumerRegistionPage.validatebtn_Loc.count();
    console.log("tolal number of disable validate buttons.....:-  ", count)
    for (let i = 0; i < count; i++) {
      await expect.soft(consumerRegistionPage.validatebtn_Loc.nth(i)).toBeDisabled();
    }
    await expect.soft(consumerRegistionPage.submitBtnLocator).toBeDisabled();

  });

  test("Verified Passing empty name", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    await consumerRegistionPage.consumerNameLocator.fill("  "),
      await consumerRegistionPage.nameValidateLocator.click();
    await expect.soft(consumerRegistionPage.valueCannotBeEmpty_Loc).toBeVisible();
  })

  test("Verified background color of Name ", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    await consumerRegistionPage.consumerNameLocator.fill("kiran999999");
    await consumerRegistionPage.consumerNameValidateLocator.click();
    await page.waitForTimeout(2000);
    await consumerRegistionPage.Name_Color.click();
    const element = await consumerRegistionPage.Name_Color;
    await homePage.backGroundColor(element);
  });

  test("Verified background color of Read/Write Group ", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    await consumerRegistionPage.consumerNameLocator.fill("kiran999999");
    await consumerRegistionPage.consumerNameValidateLocator.click();
    await page.waitForTimeout(2000);
    await consumerRegistionPage.Name_Color.click();
    await consumerRegistionPage.readwritegroupk.click();
    await consumerRegistionPage.readwritegroupk.fill("GG-HYPERDRIVE-FEATURE-TESTER");
    await consumerRegistionPage.readwritegroupiconk.click();
    await page.waitForTimeout(2000);
    await consumerRegistionPage.readwritegrouptickmark.click();
    const element = await consumerRegistionPage.Name_Color;
    await homePage.backGroundColor(element);
  });
  test("Verified invalid text Read/Write Group ", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    await consumerRegistionPage.consumerNameLocator.fill("kiran999999");
    await consumerRegistionPage.consumerNameValidateLocator.click();
    await page.waitForTimeout(2000);
    await consumerRegistionPage.Name_Color.click();
    await consumerRegistionPage.readwritegroupk.click();
    await consumerRegistionPage.readwritegroupk.fill("GG-HYPERDRIVE-FEATURE-");
    await consumerRegistionPage.readwritegroupiconk.click();
    await consumerRegistionPage.readwritegrouptickmark.click();
    await consumerRegistionPage.getTxtInvalidReadWrite();
    await page.waitForTimeout(2000);
  });

  test("verifify Consumer registrationpage is open", async () => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await consumerRegistionPage.expectConsumerHederToBeVisibleandContentIsCorrect();
  })

  test('Verifying the display of error message when an already exisiting Consumer name is provided', async ({ browser }) => {
    const homePage = new HomePage(page);
    const consumerRegistionPage = new ConsumerRegistionPage(page);
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    consumerRegistionPage.registernewConsumer("name", "discription", "GG-HYPERDRIVE-FEATURE-TESTER", "Narendra.B.Thodeti@aexp.com");
    consumerRegistionPage.submitBtnLocator.click();
    await homePage.profile();
    await homePage.selectConsumer();
    await homePage.addnewRegistration();
    await consumerRegistionPage.consumerNameLocator.fill('name');
    await consumerRegistionPage.consumerNameValidateLocator.click();
    // Waiting for the error message to be displayed
    await expect(consumerRegistionPage.duplicateNameErrorMessageLocator).toBeVisible();
  });

  test.afterEach("close browser", async () => {
    const homePage = new HomePage(page);
    await homePage.quit();
  });
});

spec
=================================================
import { test, expect } from "@playwright/test";
import HomePage from "../../pages/commonPage/homePage.js";
class ConsumerRegistionPage {
  constructor(page) {
    this.page = page;
    this.consumerNameLocator = page.locator("#name");
    this.consumerNameValidateLocator = page.locator("//input[@id='name']//following-sibling::button");
    this.readwritegroupk = page.locator("#readWriteGroup");
    this.readwritegroupiconk = page.locator("//input[@id='readWriteGroup']//following-sibling::button");
    this.readwritegrouptickmark = page.locator("(//*[name()='svg'])[3]");
    this.inputDescriptionharacterCountlocator = page.locator('//span[normalize-space()=50]');
    this.nameValidationGreenTickMarkLocator = page.locator('//input[@name="name"][@id="name"]//following-sibling::button[@aria-label ="Validate"]/span');
    this.nameValidateLocator = page.locator("//input[@id='name']//following-sibling::button");
    this.duplicateNameErrorMessageLocator = page.locator('//span[text()="Specified name is already taken. Please try another."]');
    this.descriptionLocator = page.locator("#description");
    this.descriptionharacterCountlocator = page.locator('//div[@data-testid="char-count"]').nth(1);
    this.inputDescriptionharacterCountlocator = page.locator('//div[@data-testid="char-count"]/span').nth(3);
    this.readWriteGroupLocator = page.locator("#readWriteGroup");
    this.readWriteGroupValidateLocator = page.locator("//input[@id='readWriteGroup']//following-sibling::button");
    this.readOnlyGroupLocator = page.locator("#readOnlyGroup");
    this.readOnlyGroupValidateLct = page.locator("//input[@id='readOnlyGroup']//following-sibling::button");
    this.emailDlAddressLocator = page.locator("#emailDlAddress");
    this.cancelLocator = page.locator('[data-testid="cancelBtn"]');
    this.submitBtnLocator = page.locator('[data-testid="submitBtn"]');
    this.clickSection3Loc = page.locator('[data-testid="section3"]');
    this.contactInfoLoc = page.locator("//h1[text()='Contact Information']");
    this.clickCharCount = page.locator('[data-testid="char-count"]');
    this.validatebtn_Loc = page.locator('[aria-label="Validate"]');
    this.longConsumerNameLoc = page.locator('xpath = //div/span[text()="Name is too long"]');
    this.longDescriptionLoc = page.locator('xpath = //div/span[text()="Description is too long"]');
    this.invalidIIQGroup = page.locator('xpath = //div/span[text()="Group ID not found in IIQ."]');
    this.Name_Color = page.locator("span[class='display-block css-ab09iz'] svg");
    this.invaliEmailLoc = page.locator('xpath = //div/span[text()="Email should be @aexp.com"]');
    this.invaliEmailLoc = page.locator('xpath = //div/span[text()="Email should be @aexp.com"]');
    this.hyperdriveDoc_Loc = page.locator("//span[text()='Hyperdrive documentation']/parent::a");
    this.iiqDoc_Loc = page.locator('a').getByText('IIQ documentation').nth(0);
    this.iiqDoc_Loc2 = page.locator('a').getByText('IIQ documentation').nth(1);
    this.readWriteUrl_Loc = page.locator("span:text('Can\’t find your IIQ group?')").locator('..').first();
    this.readOnlyUrl_Loc1 = page.locator("span:text('Can\’t find your IIQ group?')").locator('..').nth(1);
    this.emailDistributionUrl_Loc = page.locator("span:text('Can’t find your distribution address?')").locator('..');
    this.valueCannotBeEmpty_Loc = page.locator('xpath = //span[text()="The value cannot be empty."]');
    this.importentNoteTextDiscription_Loc1 = page.locator("//div[@id='usageAgreement']/div/div[1]");
    this.importentNoteTextDiscription_Loc2 = page.locator("//div[@id='usageAgreement']/div/div[2]");
    this.consumerNameTextDiscription_Loc = page.locator('xpath = //div[@data-testid="section1"]/div/p');
    this.registraionParagraphText_Loc = page.locator('xpath = //div[@data-testid="section2"]/div/p');
    this.readWriteGroupTextDiscription_Text_Loc = page.locator('xpath = //span[@for="readWriteGroup"]/div');
    this.readOnlyGroupTextDiscription_Loc = page.locator('xpath = //span[@for="readOnlyGroup"]');
    this.Name_Color = page.locator("(//*[name()='path'])[3]");
  }

  async registernewConsumer(name, discription, readWriteGroup, emailDlAddress) {
    await this.consumerNameLocator.fill(name);
    await this.nameValidateLocator.click();
    await this.descriptionLocator.fill(discription);
    await this.page.waitForTimeout(1000);
    await this.readWriteGroupLocator.fill(readWriteGroup);
    await this.readWriteGroupValidateLocator.click();
    await this.readWriteGroupValidateLocator.dblclick();
    await this.page.waitForTimeout(1000);
    await this.emailDlAddressLocator.fill(emailDlAddress);
    await this.clickSection3Loc.click();
    await this.page.waitForTimeout(1000);
  }

  async registeringfornewconsumer(
    name,
    discription,
    readWriteGroup,
    emailDlAddress
  ) {
    await this.consumerNameLocator.fill(name);
    await this.nameValidateLocator.click();
    await this.descriptionLocator.fill(discription);
    await this.page.waitForTimeout(1000);
    await this.iiqGroupLocator.fill(readWriteGroup);
    await this.iiqGroupValidateLocator.click();
    await this.page.waitForTimeout(1000);
    await this.emailDlAddressLocator.fill(emailDlAddress);
    await this.clickSection3Loc.click();
    await this.page.waitForTimeout(1000);
  }
  async clickOnSubmitBtn() {
    await this.submitBtnLocator.click();
  }
  async clickOnCancelBtn() {
    await this.cancelLocator.click();
  }
  async getTxtlongConsumer() {
    await this.page.waitForSelector('//span[text()="Name is too long"]');
    let errMsg = await this.longConsumerNameLoc.innerText();
    return errMsg;
  }
  async getTxtlongDescription() {
    const scroll = await this.longDescriptionLoc;
    await scroll.scrollIntoViewIfNeeded();
    await this.page.waitForSelector('//span[text()="Description is too long"]');
    let errMsg = await this.longDescriptionLoc.innerText();
    return errMsg;
  }
  async getRegistrationParagraphText(selectors) {
    const paragraphText = [];
    for (const selector of selectors) {
      let text = await selector.innerText();
      paragraphText.push(text);
    }

    return paragraphText;
  }
  async getTxtInvalidEmail() {
    const scroll = this.invaliEmailLoc;
    await this.contactInfoLoc.click();
    await scroll.scrollIntoViewIfNeeded();
    await this.page.waitForSelector('//span[text()="Email should be @aexp.com"]');
    return await this.invaliEmailLoc.innerText();

  }

  async getTxtInvalidReadWrite() {
    const scroll = this.invalidIIQGroup;
    // await scroll.scrollIntoViewIfNeeded();
    await this.page.waitForSelector('//div/span[text()="Group ID not found in IIQ."]');
    let errMsg = await this.invalidIIQGroup.innerText();
    return errMsg;
  }

  async expectConsumerHederToBeVisibleandContentIsCorrect() {
    await expect(this.page.locator('//h4[normalize-space()="Consumer Dashboard"]')).toBeVisible();
    expect(this.page.locator('//h4[normalize-space()="Consumer Dashboard"]')).toContainText("Consumer Dashboard");
  }

  async getTxtValuecannotBeEmpty() {
    await this.page.waitForSelector('//span[text()="The value cannot be empty."]');
    const scroll = this.valueCannotBeEmpty_Loc;
    await this.page.waitForTimeout(1000);
    await scroll.scrollIntoViewIfNeeded();
    await this.page.waitForSelector('//span[text()="The value cannot be empty."]');
    let errMsg = await this.valueCannotBeEmpty_Loc.innerText();
    return errMsg;
  }

}

export default ConsumerRegistionPage;










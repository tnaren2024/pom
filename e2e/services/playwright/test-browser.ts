import { Browser, chromium } from "@playwright/test";
import { startStep } from "../log-handler";
import { Actions } from "./actions";
import { isCI } from "../../utils/environment/env-utils";

export class TestBrowser {
    private browserLabel: string;
    private browser: Browser | undefined;
    public actions: Actions | undefined;

    private constructor(browserLabel: string) {
        this.browserLabel = browserLabel;
    }

    /**
     * Open a new instance of browser to test 2 personas in parallel within same test case
     * @param browserLabel label for browser instance
     * @param headed Is headless or not //TODO sead headed mode based in cli params
     * @returns TestBrowser instance
     */
    public static async openNewBrowser(browserLabel: string, headed?: boolean): Promise<TestBrowser> {
        const instance = new TestBrowser(browserLabel);
        const logger = startStep("Opening new browser", instance.browserLabel);
        instance.browser = await chromium.launch({ headless: isCI() || !headed }); //CI runs will always be headless
        const page = await instance.browser.newPage();
        page.setViewportSize({ width: 1920, height: 1080 }); //Default used in playwright config
        instance.actions = new Actions(page, browserLabel);
        logger.end();
        return instance;
    }

    public async close() {
        const logger = startStep("Closing browser", this.browserLabel);
        await this.browser?.close(); // Using optional chaining operator
        logger.end();
    }
}

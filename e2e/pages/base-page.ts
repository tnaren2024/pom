import { Actions } from "../services/playwright/actions"; // Import the Actions class from the Playwright services

/**
 * The `BasePage` class serves as a foundational class for page objects in a Playwright-based testing framework.
 * It encapsulates common functionalities that are shared across different page objects, specifically handling
 * actions on the page and providing a consistent logging label for the actions performed.
 */
export class BasePage {
    protected actions: Actions;
    /**
     * The constructor initializes the BasePage with a given set of actions and a page label.
     * It clones the provided actions to ensure that each page object operates with its own instance of actions.
     * The page label is used for logging purposes to identify actions performed on specific pages.
     * @param actions - The Actions object that provides methods to interact with the page
     * @param pageLabel - A string label for logging purposes to identify the page
     */
    constructor(actions: Actions, pageLabel: string) {
        this.actions = this.cloneActions(actions);
        this.actions.logLabel = pageLabel;
    }
    /**
     * The `cloneActions` method creates a new instance of the Actions class with the same page and log label
     * as the provided Actions object. This method ensures that each page object gets a separate instance of Actions
     * to avoid conflicts and maintain isolation between different page objects.
     * @param action - The Actions object to be cloned
     * @returns A new instance of the Actions class with the same page and log label
     */
    private cloneActions(action: Actions): Actions {
        const cloned = new Actions(action.page, action.logLabel);
        return cloned;
    }
}

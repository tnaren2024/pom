import { test } from "@playwright/test";
import { Actions } from "./services/playwright/actions";
import { getAnnotations } from "./utils/tag-utils";

/**
 * Interface for the Vnext test fixture.
 * @interface IVnextTestFixture
 * @property {Actions} actions - Instance of Actions class for test actions.
 */
export interface IVnextTestFixture {
    actions: Actions;
}

/**
 * Extends Playwright's test framework to include custom setup based on test annotations.
 * @param {IVnextTestFixture} fixture - Test fixture interface for Vnext test.
 */
export const vTest = test.extend<IVnextTestFixture>({
    actions: async ({ page }, use) => {
        // Get test title
        const title = test.info().title;

        // Get annotations and errors from test title
        const annotationsResponse = getAnnotations(title);

        // If there are errors in annotations, log them and continue without annotations
        if (!annotationsResponse.success) {
            console.error(`Test ${title} has errors:: ${annotationsResponse.errors.join(", ")}`);
            test.info().annotations = []; // Reset annotations
        } else {
            // Add annotations if available
            test.info().annotations.push(...annotationsResponse.annotations);
        }

        // Initialize Actions instance for test actions
        const actions = new Actions(page);

        // Provide actions to the test
        use(actions);
    }
});

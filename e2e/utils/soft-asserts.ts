import { assertEquals, assertNotEquals, assertTrue } from "./assert-utils";

/**
 * SoftAssert class allows collecting multiple assertions and throwing an error
 * only after all assertions have been verified, logging all failures at once.
 */
export class SoftAssert {
    private assertions: (() => void)[] = [];
    private description: string;

    /**
     * Constructs a SoftAssert instance with an optional description.
     * @param description Optional description for the SoftAssert instance.
     */
    constructor(description = "") {
        this.description = description;
    }

    /**
     * Asserts that the actual value is equal to the expected value.
     * @param actual Actual value to be compared.
     * @param expected Expected value to compare against.
     * @param failureMessage Optional message to display if the assertion fails.
     */
    public assertEquals(actual: any, expected: any, failureMessage?: string) {
        const assertion = () => assertEquals(actual, expected, failureMessage);
        this.assertions.push(assertion);
    }

    /**
     * Asserts that the actual value is not equal to the expected value.
     * @param actual Actual value to be compared.
     * @param expected Expected value to compare against.
     * @param failureMessage Optional message to display if the assertion fails.
     */
    public assertNotEquals(actual: any, expected: any, failureMessage?: string) {
        const assertion = () => assertNotEquals(actual, expected, failureMessage);
        this.assertions.push(assertion);
    }

    /**
     * Asserts that the actual value is true.
     * @param actual Actual value to be evaluated as true.
     * @param failureMessage Optional message to display if the assertion fails.
     */
    public assertTrue(actual: any, failureMessage?: string) {
        const assertion = () => assertTrue(actual, failureMessage);
        this.assertions.push(assertion);
    }

    /**
     * Verifies all assertions collected by SoftAssert. If any assertion fails,
     * it throws an error and logs all failure exceptions.
     * @param failureMessage Message to display if the assertion fails.
     */
    public assertAll(failureMessage: string) {
        const exceptions: any[] = [];
        this.assertions.forEach(assertion => {
            try {
                assertion();
            } catch (e) {
                exceptions.push(e);
            }
        });
        if (exceptions.length > 0) {
            const message = `SoftAssert failed: ${this.description} :: ${failureMessage}`;
            console.error(message);
            console.log("Failure exceptions:");
            this.printAllExceptions(exceptions);
            throw new Error(message);
        } else {
            console.log(`SoftAssert passed: ${this.description}`);
        }
    }

    /**
     * Logs all exception messages to the console.
     * @param exceptions Array of exceptions to be logged.
     */
    private printAllExceptions(exceptions: any[]) {
        exceptions.forEach(e => {
            console.error(e);
        });
    }
}

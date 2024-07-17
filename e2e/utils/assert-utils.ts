import assert from "assert";
import { endLog, errorLog, startLog } from "../services/log-handler";

/**
 * AssertEquals
 * Assertion function that validates whether the actual value is equal to the expected value or not.
 * Logs the start of the assertion, performs the assertion, logs the end, and handles any errors.
 * @param actual Actual value
 * @param expected Expected value
 * @param failureMessage Message to display if the assertion fails
 */
export const assertEquals = (actual: any, expected: any, failureMessage?: string) => {
    const logMessage = `Assert; expected: ${expected} ;; actual: ${actual}`;
    startLog(logMessage);
    try {
        assert.strictEqual(actual, expected, `${failureMessage} <<>> ${logMessage}`);
    } catch (e) {
        errorLog(logMessage);
        throw e;
    }
    endLog(logMessage);
};

/**
 * AssertNotEquals
 * Assertion function that validates the actual value is not equal to the expected value.
 * Logs the start of the assertion, performs the assertion, logs the end, and handles any errors.
 * @param actual Actual value
 * @param expected Expected value
 * @param failureMessage Message to display if the assertion fails
 */
export const assertNotEquals = (actual: any, expected: any, failureMessage?: string) => {
    const logMessage = `Assert; expected: ${expected} ;; actual: ${actual}`;
    startLog(logMessage);
    try {
        assert.notStrictEqual(actual, expected, `${failureMessage} <<>> ${logMessage}`);
    } catch (e) {
        errorLog(logMessage);
        throw e;
    }
    endLog(logMessage);
};

/**
 * AssertTrue
 * Assertion function verifies that the actual value is true.
 * Logs the start of the assertion, performs the assertion, logs the end, and handles any errors.
 * @param actual The actual value
 * @param failureMessage Message to display if the assertion fails
 */
export const assertTrue = (actual: any, failureMessage?: string) => {
    const logMessage = `Assert; expected: true ;; actual: ${actual}`;
    startLog(logMessage);
    try {
        assert.ok(actual, `${failureMessage} <<>> ${logMessage}`);
    } catch (e) {
        errorLog(logMessage);
        throw e;
    }
    endLog(logMessage);
};

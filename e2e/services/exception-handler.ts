import { IElement } from "../types/element";

export enum ActionLabel {
    CLICK = "Click",
    DOUBLE_CLICK = "Double click",
    RIGHT_CLICK = "Right click",
    WAIT = "Wait",
    INPUT = "Input",
    CLEAR = "Clear",
    GET = "Get",
    HOVER = "Hover",
    FOCUS = "Focus",
    SCROLL_INTO_VIEW = "Scroll into view"
}

/**
 * All exceptions thrown by element actions will be wrapped in this exception.
 * @param exception Exception to handle
 * @param action Action performed on element (click, input, etc.)
 * @param element Element that the action was performed on which caused the exception
 * @param pageLabel Label of the page that the element is on (if applicable)
 */

export const handleElementException = async (exception: any, action: ActionLabel, element: IElement, pageLabel = "") => {
    const excptionLines = exception.toString().split("\n");
    const message = excptionLines[0];
    if (message.includes("Target closed")) {
        throw new Error(
            `[[ElementException]] {action: ${action}, element: ${element.label || element.elementLocator.locator}, page: ${pageLabel}}`
        );
    } else {
        throw exception;
    }
};

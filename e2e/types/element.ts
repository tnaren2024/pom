export enum LocatorType {
    CSS,
    XPATH,
    TEST_ID,
    ROLE,
    LABEL,
    TEXT,
    NAME
}

export interface IElementLocator {
    locator: string | RegExp;
    locatorType: LocatorType;
}

export interface IElement {
    elementLocator: IElementLocator;
    label: string;
    backupLocators: IElementLocator[];
}

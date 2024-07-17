export enum TestEnvironment {
    DEV = "dev"
}

export interface ITestEnvironment {
    appUrl: string;
}

/**
 * Add any new environment data here
 */
export const environments = {
    dev: {
        appUrl: "http://localhost:5173/main"
    } as ITestEnvironment
};

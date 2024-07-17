export interface ITestData {
    reusable?: boolean; //Set to true only if there is no edits are happening in the data
    users: IUser[];
    connections?: IConnection[];
    IntegrationType?: IntegrationType[];
}

export interface IUser {
    email: string;
    password: string;
    name: string;
}

export interface IConnection {
    testId?: number;
    id?: number;
    name: string;
    type?: IntegrationType;
    public?: boolean;
    organizationId: number;
    creatorId: number;
    credentials: string;
}

export enum IntegrationType {
    EXCEL = "Excel",
    ADO = "Ado",
    POWERBI = "PowerBi",
    PLANNER = "Planner"
}

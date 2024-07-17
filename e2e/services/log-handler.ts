export enum LogMarker {
    START = "[[START]]",
    END = "[[END]]",
    ERROR = "[[ERROR]]",
    INFO = "[[INFO]]",
    NONE = "", // no marker
    PASS = "[[PASS]]",
    FAIL = "[[FAIL]]"
}

/**
 * Logs the start of an action to the console with a [[START]] marker
 * @param message Log message to display
 * @param logLabel Optional label to display in the log
 */
export const startLog = (message: string, logLabel = "") => {
    consoleLog(LogMarker.START, message, logLabel);
};

/**
 * Logs the end of an action to the console with a [[END]] marker
 * @param message Log message to display
 * @param logLabel Optional label to display in the log
 */
export const endLog = (message: string, logLabel = "") => {
    consoleLog(LogMarker.END, message, logLabel);
};

/**
 * Logs error messages to the console with a [[ERROR]] marker
 * @param message Error message to display
 * @param logLabel Optional label to display in the log
 */
export const errorLog = (message: string, logLabel = "") => {
    consoleLog(LogMarker.ERROR, message, logLabel);
};

/**
 * Logs messages to the console with a custom marker
 * @param logMarker Marker to display in the log
 * @param message Log message to display
 * @param logLabel Optional label to display in the log
 */
export const consoleLog = (logMarker: LogMarker, message: string, logLabel = "") => {
    logLabel = logLabel ? `[${logLabel}] :: ` : "";
    console.log(`${logLabel}${message} ${logMarker}`);
};

/**
 * Logs error messages to the console with a custom marker
 * @param logMarker Marker to display in the log
 * @param message Error message to display
 * @param logLabel Optional label to display in the log
 */
export const consoleError = (logMarker: LogMarker, message: string, logLabel = "") => {
    logLabel = logLabel ? `[${logLabel}] :: ` : "";
    console.error(`${logLabel}${message} ${logMarker}`);
};

/**
 * Initiates a step logger for a specific action with a start message
 * @param message Step description
 * @param logLabel Optional label to display in the log
 * @returns StepLogger instance
 */
export const startStep = (message: string, logLabel = "") => {
    logLabel = logLabel ? `[${logLabel}] :: ` : "";
    const logger = new StepLogger(`${logLabel}${message}`);
    logger.start();
    return logger;
};

/**
 * Wraps a callback function with step logging around it
 * @param message Step description
 * @param logLabel Optional label to display in the log
 * @param callback Callback function to wrap with step logging
 * @returns Result of the callback function
 */
export const withStepLogs = async (message: string, logLabel = "", callback: () => Promise<any>) => {
    logLabel = logLabel ? `[${logLabel}] :: ` : "";
    const logger = new StepLogger(`${logLabel}${message}`);
    logger.start();
    const ret = await callback();
    logger.end();
    return ret;
};

/**
 * Class for logging steps with start and end markers along with duration
 */
export class StepLogger {
    private log: string;
    private startTime: any;

    constructor(log: string) {
        this.log = log;
    }

    /**
     * Logs the start of a step with a [[START]] marker and records start time
     */
    public start() {
        console.log(`${this.log} ${LogMarker.START}`);
        this.startTime = Date.now();
    }

    /**
     * Logs the end of a step with an [[END]] marker, duration, and displays the log
     */
    public end() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        const durationText = duration > 60000 ? `${duration / 60000}min` : duration > 1000 ? `${duration / 1000}s` : `${duration}ms`;
        console.log(`${this.log} ${LogMarker.END} - ${durationText}`);
    }
}

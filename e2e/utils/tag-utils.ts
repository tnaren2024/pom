export const PRIORITIES = ["P0", "P1", "P2"];
export const PODS = ["INTEGRATIONS", "CORETEST"];
export const TESTTYPE = ["SANITY", "REGRESSION"];

/**
 * Get annotations from test title. If mandatory tags are missing, attach error.
 * Priority and pod tags are mandatory.
 * @param title Test title
 * @returns Annotations and errors
 * {
 *   success: boolean,
 *   annotations: { type: string; description?: string }[],
 *   errors: string[]
 * }
 */
export const getAnnotations = (title: string) => {
    const annotations: { type: string; description?: string }[] = [];
    const errors: string[] = [];
    const tags = title.match(/@\w+/g)?.map(tag => tag.replace("@", "")) || [];

    // Priority
    const priority = tags.find(tag => PRIORITIES.includes(tag));
    if (priority) {
        annotations.push({ type: "priority", description: priority });
    } else {
        errors.push("Priority tag is not set");
    }

    // Test Type
    const testType = tags.find(tag => TESTTYPE.includes(tag));
    if (testType) {
        annotations.push({ type: "testtype", description: testType });
    } else {
        errors.push("Test Type tag is not set. Add @testType tag to the test title");
    }

    // Pod
    const pod = tags.find(tag => PODS.includes(tag));
    if (pod) {
        annotations.push({ type: "pod", description: pod });
    } else {
        errors.push("Pod tag is not set");
    }

    // ADO ID
    const adoId = tags.find(tag => tag.startsWith("ADO_"));
    if (adoId) {
        annotations.push({ type: "ADO_ID", description: adoId.replace("ADO_", "") });
    } else {
        errors.push("ADO id is not set. Add @ADO_<id> tag to the test title");
    }

    // Other Tags
    const otherTags = tags.filter(tag => !PODS.includes(tag) && !PRIORITIES.includes(tag));
    otherTags.forEach(tag => {
        annotations.push({ type: "tag", description: tag });
    });

    return {
        success: !errors.length,
        annotations: annotations,
        errors: errors
    };
};

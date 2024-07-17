import { vTest } from "../../..";
import { LoginPage } from "../../../pages/login/login-page";
import { getTestData } from "../../../services/test-data/test-data-service";

// Define a Vtest to log in to the Vnext application with valid credentials

vTest("Login to Vnext application with valid creds @P0 @SANITY", async ({ actions }) => {
    // Retrieve test data needed for the test
    const data = await getTestData("pre-seeded-data");

    // Select the first user from the retrieved data
    const user = data.users && data.users[0];

    // Instantiate the LoginPage with the provided actions
    const loginPage = new LoginPage(actions);

    // Perform login to the Vnext application using the selected user
    await loginPage.loginToGoals(user);

    // Assert that the page title after login is "Viva Goals"
    await actions.assertPageTitle("Viva Goals");
});

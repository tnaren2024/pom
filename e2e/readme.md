# E2E Test Automation Framework

## Pre-requisites

### Clone the Latest Microservices Build

1. Clone the repository containing the latest microservices build:
    ```bash
    git clone <repository-url>
    cd sources/Goalsv2/client
    ```
2. Follow the instructions in the README file inside the `client` directory to install the necessary dependencies.

## Install Dependencies and Setup

1. Ensure all dependencies are installed as per the README file.
2. After installation, start the application using:
    ```bash
    pnpm nx start viva-goals-app
    ```

## Environment Configuration

### Setup Environment Variables

1. Create a `.env` file in your local machine under the `e2e` folder.
2. Add the following variables to the `.env` file:
    ```env
    AZURE_DEVOPS_ORG=O365Exchange
    AZURE_DEVOPS_PROJECT=Viva Ally
    AZURE_DEVOPS_EXT_PAT=xxxxxxx
    AZURE_DEVOPS_VARIABLE_GROUP_ID=921
    ```
    **Note:** Replace `xxxxxxx` in `AZURE_DEVOPS_EXT_PAT` with your personal access token.
    The token should have read access to Azure Variable Groups and Libraries where secrets are stored.

## Running the Application

1. Start the application:
    ```bash
    pnpm nx start viva-goals-app
    ```

## Running the Tests

You can run the end-to-end tests in either headed or headless mode using the following commands:

-   **Headed Mode:**
    ```bash
    pnpm nx test:e2e_headed viva-goals-app
    ```
-   **Headless Mode:**
    ```bash
    pnpm nx test:e2e viva-goals-app
    ```

---

This README file provides a streamlined guide for running the end-to-end tests locally, ensuring all necessary pre-requisites are met, and the environment is properly configured.

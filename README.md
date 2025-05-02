# Simple SSLCommerz Integration Practice (Backend)

This is a backend project demonstrating a basic integration with the SSLCommerz payment gateway. It's built using Node.js, Express.js, and MongoDB.

## Technologies Used

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Minimalist web application framework for Node.js.
* **MongoDB:** NoSQL database for storing payment information.
* **dotenv:** Load environment variables from a `.env` file.
* **cors:** Middleware to enable Cross-Origin Resource Sharing.
* **mongodb:** MongoDB driver for Node.js.
* **axios:** Promise-based HTTP client for making API requests.

## Prerequisites

* **Node.js and npm (or yarn):** Ensure you have Node.js and npm (Node Package Manager) or yarn installed on your system. You can download them from [nodejs.org](https://nodejs.org/).
* **MongoDB:** You need a running MongoDB instance. You can either have it installed locally or use a cloud-based service like MongoDB Atlas.
* **SSLCommerz Sandbox Account:** You'll need a sandbox account with SSLCommerz to obtain your `STORE_ID` and `STORE_PASS`. You can sign up for a sandbox account on the [SSLCommerz website](https://developer.sslcommerz.com/).

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root directory of the project and add your environment variables. Replace the placeholder values with your actual credentials.
    ```env
    PORT=3000
    DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"
    STORE_PASS="YOUR_SSLCOMMERZ_STORE_PASSWORD"
    STORE_ID="YOUR_SSLCOMMERZ_STORE_ID"
    ```
    **Note:** Ensure your MongoDB connection string (`DATABASE_URL`) is correct and points to your MongoDB database.

## Running the Application

1.  **Start the backend server:**
    ```bash
    npm run start
    # or
    yarn dev
    ```
    This command will start the server (likely on `http://localhost:3000` or the port specified in your `.env` file).

## API Endpoints

The backend provides the following API endpoints:

* **`POST /create-ssl-payment`:**
    * Accepts a JSON request body containing payment details, including `price` and `email`.
    * Initiates the SSLCommerz payment process by sending data to the SSLCommerz sandbox API.
    * Saves the initial payment information (including a generated `transitionId`) to the MongoDB `payments` collection.
    * Returns a JSON response with the `gatewayUrl` provided by SSLCommerz, which the frontend should redirect the user to for payment.

* **`POST /success-payment`:**
    * This endpoint is the `success_url` configured in the payment initiation. SSLCommerz will redirect the user to this URL upon successful payment.
    * It receives payment success details in the request body.
    * It validates the payment using the SSLCommerz validation API.
    * If the payment is valid, it deletes the corresponding pending payment record from the `payments` collection.
    * Finally, it redirects the user to the `/success` route on the frontend application (configured as `http://localhost:5173/success`).

* **`POST /payment-failed`:**
    * This endpoint is the `fail_url` configured in the payment initiation. SSLCommerz will redirect the user here if the payment fails.
    * It logs the payment failure details and redirects the user to the `/fail` route on the frontend (`http://localhost:5173/fail`).

* **`POST /payment-cancelled`:**
    * This endpoint is the `cancel_url` configured in the payment initiation. SSLCommerz will redirect the user here if the user cancels the payment.
    * It logs the payment cancellation details and redirects the user to the `/cancel` route on the frontend (`http://localhost:5173/cancel`).

* **`POST /ipn-success-payment`:**
    * This endpoint is the `ipn_url` (Instant Payment Notification URL). SSLCommerz will send a POST request to this URL with payment confirmation details.
    * **Note:** This endpoint currently only logs the received data. You would typically implement more robust logic here to update your database and handle post-payment tasks.

* **`GET /`:**
    * A simple root route that returns the string "Running........." to indicate the server is active.

## Important Considerations

* **Environment Variables:** Never hardcode sensitive information like your database URL, store ID, and store password directly in your code. Always use environment variables.
* **Security:** This is a basic example and may not include all necessary security measures for a production environment. Ensure you implement proper security practices, such as input validation, secure handling of API keys, and protection against common web vulnerabilities.
* **Error Handling:** Implement more comprehensive error handling to gracefully manage potential issues during API requests and database operations.
* **IPN Handling:** The `/ipn-success-payment` endpoint needs to be implemented with proper logic to handle IPN requests from SSLCommerz reliably. This is crucial for confirming successful payments even if the user is redirected away before the `/success-payment` endpoint is hit.
* **Frontend Integration:** This backend is designed to work with a frontend application (e.g., running on `http://localhost:5173`) that initiates the payment request and handles the redirects after payment success, failure, or cancellation.
* **Sandbox vs. Production:** This code is configured to use the SSLCommerz sandbox environment (`https://sandbox.sslcommerz.com`). When deploying to a production environment, you will need to update the API URLs to the live SSLCommerz gateway.

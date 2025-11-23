# Automation Testing Guide

This guide outlines the steps to implement and run automation tests for the ResumeForge application.

## 🧪 Current Test Suite

We currently have an **Integration Test Suite** located in `tests/integration/`.

### Auth Flow Test (`auth_flow.test.js`)
This script tests the entire authentication and email verification flow:
1.  **Registration**: Creates a new user via the API.
2.  **Database Verification**: Checks if the user is created in the database (unverified).
3.  **OTP Retrieval**: Fetches the generated OTP from the database (simulating checking email).
4.  **Email Verification**: Verifies the email using the OTP via the API.
5.  **Final Verification**: Confirms the user is marked as verified in the database.
6.  **Resend OTP**: Tests the resend functionality.

### Parsing Logic Test (`parsing_logic.test.js`)
This script validates the resume parsing core and API security:
1.  **Flask Parser Service**: Sends a dummy PDF directly to the Flask service (`:5001`) to verify text extraction logic works.
2.  **API Security**: Sends an unauthenticated request to the Next.js API (`:3000/api/parse-resume`) to verify it returns `401 Unauthorized`.

## 🚀 How to Run Tests

### Prerequisites
1.  **Database**: Ensure your PostgreSQL database is running and the schema is synced.
    ```bash
    npx prisma db push
    ```
2.  **Server**: The Next.js development server must be running.
    ```bash
    npm run dev
    ```
    *Note: If you recently changed the database schema, restart the server.*

### Running All Tests
Run the following command in a separate terminal window to execute all tests found in the `tests/` directory:

```bash
npm test
```

This will run the custom test runner (`tests/runner.js`) which executes every `.test.js` file it finds.

## 🛠️ Implementing New Tests

To add more automation tests to your project, follow these steps:

### 1. Create a Test File
Create a new file in the `tests/integration/` directory, e.g., `resume_parsing.test.js`.

### 2. Import Dependencies
You'll likely need `node-fetch` (or native `fetch` in Node 18+) and `PrismaClient`.

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
```

### 3. Write Test Logic
Structure your test with a `main` async function. Use `try/catch` blocks to handle errors and ensure the process exits with `1` on failure.

```javascript
async function main() {
  try {
    // Your test logic here
    console.log('✅ Test Passed');
  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### 4. Add to Package.json (Optional)
You can add a script to `package.json` for easier execution:

```json
"scripts": {
  "test:parsing": "node tests/integration/resume_parsing.test.js"
}
```

## 🔍 Troubleshooting

### `TypeError: Cannot read properties of undefined (reading 'create')`
This usually means the Prisma Client is stale.
**Fix**:
1.  Stop the running server (`Ctrl+C`).
2.  Run `npx prisma generate`.
3.  Restart the server (`npm run dev`).

### `Connection refused`
The test script cannot connect to the API.
**Fix**: Ensure `npm run dev` is running on `localhost:3000`.

### `User already exists`
The test script attempts to clean up data, but if it fails mid-way, data might remain.
**Fix**: The script handles cleanup, but you can manually delete the test user from the database if needed.

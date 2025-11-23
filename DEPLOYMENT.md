# Deploying ResumeForge to Vercel

This guide explains how to deploy the ResumeForge application (Next.js Frontend + Flask Backend) to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account.
- The [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended for testing).

## Configuration

The project is already configured with a `vercel.json` file that handles the build and routing for both the Next.js and Python components.

- **Frontend**: Built using `@vercel/next`.
- **Backend**: Built using `@vercel/python`.
- **Routing**: Requests to `/api/python/*` are routed to the Flask app.

## Deployment Steps

1.  **Push to GitHub**: Ensure your latest changes (including `vercel.json`) are pushed to your GitHub repository.

2.  **Import Project in Vercel**:
    - Go to your Vercel dashboard.
    - Click "Add New..." -> "Project".
    - Import your `resumeforge` repository.

3.  **Environment Variables**:
    - In the "Configure Project" step, add the following environment variables:
        - `OPENAI_API_KEY`: Your OpenAI API key.
        - `FLASK_PARSER_URL`: (Optional) You can leave this empty, and it will default to the Vercel deployment URL + `/api/python`. If you need to override it, you can set it here.

4.  **Deploy**: Click "Deploy".

## Troubleshooting: "Authentication Required" Error

If you see an error saying "Authentication Required" or "Failed to parse Flask response as JSON" with HTML content, it means Vercel's **Deployment Protection** is blocking the API route from talking to the backend.

**Solution 1: Disable Vercel Authentication (Easiest)**
1.  Go to your Vercel Project Dashboard.
2.  Navigate to **Settings** > **Deployment Protection**.
3.  Find **Vercel Authentication**.
4.  Toggle it **OFF** (or disable it for the specific environment you are testing).
5.  Save changes.

**Solution 2: Use a Bypass Secret (Secure)**
1.  Go to **Settings** > **Deployment Protection** > **Vercel Authentication**.
2.  Click "Manage" or look for "Bypass for Automation".
3.  Generate a secret.
4.  Go to **Settings** > **Environment Variables**.
5.  Add a new variable named `VERCEL_AUTOMATION_BYPASS_SECRET` with the value of the secret you generated.
6.  Redeploy your application.

## Verification

After deployment:

1.  Open your deployed application URL.
2.  Navigate to the "Upload Resume" section.
3.  Upload a resume and paste a job description.
4.  If the "Suggestions" page loads with AI-generated content, the deployment is successful!

## Local Development

To run the project locally with Vercel emulation:

```bash
vercel dev
```

This will start both the Next.js frontend and the Python backend as they would run on Vercel.

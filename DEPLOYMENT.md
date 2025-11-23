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

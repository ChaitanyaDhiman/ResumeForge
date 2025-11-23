# Setting Up Google Authentication

To enable "Sign In with Google", you need to create a Google Cloud Project and get your Client ID and Client Secret.

## Step 1: Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top bar and select **"New Project"**.
3.  Name it `ResumeForge` (or anything you like) and click **Create**.
4.  Select your new project from the notification or dropdown.

## Step 2: Configure OAuth Consent Screen

1.  In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2.  Select **External** (unless you have a Google Workspace organization) and click **Create**.
3.  **App Information**:
    - **App name**: ResumeForge
    - **User support email**: Select your email.
    - **Developer contact information**: Enter your email.
4.  Click **Save and Continue** through the "Scopes" section (you don't need special scopes for just sign-in).
5.  **Test Users**: Add your own email address so you can test the login before verification.
6.  Click **Save and Continue** until finished.

## Step 3: Create Credentials

1.  Go to **APIs & Services** > **Credentials**.
2.  Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
3.  **Application type**: Select **Web application**.
4.  **Name**: `ResumeForge Web Client`.
5.  **Authorized JavaScript origins**:
    - Add `http://localhost:3000` (for local development).
    - Add your Vercel production URL (e.g., `https://resumeforge-app.vercel.app`).
6.  **Authorized redirect URIs**:
    - Add `http://localhost:3000/api/auth/callback/google`.
    - Add `https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/google` (Replace with your actual Vercel domain).
7.  Click **Create**.

## Step 4: Get Your Keys

1.  A popup will show your **Client ID** and **Client Secret**.
2.  Copy these keys.

## Step 5: Configure Environment Variables

### For Local Development
Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-openssl-rand-base64-32-to-generate-this
```

### For Vercel Deployment
1.  Go to your Vercel Project Settings > **Environment Variables**.
2.  Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
3.  Add `NEXTAUTH_SECRET` (generate a random string).
4.  Add `NEXTAUTH_URL` (set this to your Vercel deployment URL, e.g., `https://resumeforge.vercel.app`).

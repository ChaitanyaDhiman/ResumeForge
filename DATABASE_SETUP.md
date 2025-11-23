# Database Setup

This guide explains how to set up a PostgreSQL database for ResumeForge and connect it using Prisma.

## Prerequisites
- **Prisma Version**: This project uses Prisma v5.x
- **Database**: PostgreSQL (any provider: Vercel, Supabase, Neon, Railway, local, etc.)

## 1. Create a PostgreSQL Database

### Option A: Vercel Postgres
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project (`resumeforge`).
3.  Navigate to the **Storage** tab.
4.  Click **Create Database** and select **Postgres**.
5.  Give it a name (e.g., `resumeforge-db`) and select a region.
6.  Click **Create**.

### Option B: Other Providers
You can use any PostgreSQL provider (Supabase, Neon, Railway, local PostgreSQL, etc.). Just obtain the connection string from your provider.

## 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

**Important**: The `DATABASE_URL` variable is required by Prisma. This is the connection string to your PostgreSQL database.

### Additional Variables (Optional)
If you have other database-related environment variables from your provider, you can add them as well:
```env
POSTGRES_URL="..."
PRISMA_DATABASE_URL="..."
```

However, only `DATABASE_URL` is used by Prisma in the current configuration.

## 3. Verify Prisma Configuration

Ensure your `prisma/schema.prisma` uses the correct environment variable:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 4. Initialize Database (After Code Setup)
Once you have added the environment variables locally, run the following command in your terminal to push the schema to your new database:

```bash
npx prisma db push
```

This will create the necessary tables (`User`, `Account`, `Session`, etc.) in your Vercel Postgres database.

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

This will create the necessary tables (`User`, `Account`, `Session`, `OptimizationLog`, `OtpToken`, etc.) in your PostgreSQL database.

## 5. Security Best Practices

### Connection Security

#### Use SSL/TLS Connections
For production databases, always use SSL/TLS encryption:

```env
# Add sslmode parameter to connection string
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public&sslmode=require"
```

#### Connection Pooling
To prevent connection exhaustion and improve performance:

**For Serverless Environments (Vercel, AWS Lambda):**
Use a connection pooler like [PgBouncer](https://www.pgbouncer.org/) or your provider's built-in pooling:

```env
# Vercel Postgres provides pooled connections
DATABASE_URL="postgres://..."  # Direct connection
POSTGRES_URL_NON_POOLING="..." # Non-pooled (for migrations)
```

**Prisma Configuration:**
Add to your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Recommended connection pool settings
  // Note: Actual pooling depends on your deployment environment
}
```

### Access Control

1. **Principle of Least Privilege**: Create a dedicated database user with only necessary permissions:
   ```sql
   CREATE USER resumeforge_app WITH PASSWORD 'strong_password';
   GRANT CONNECT ON DATABASE resumeforge TO resumeforge_app;
   GRANT USAGE ON SCHEMA public TO resumeforge_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO resumeforge_app;
   ```

2. **Separate Users for Different Environments**: Use different database users for development, staging, and production.

3. **IP Whitelisting**: Configure your database to only accept connections from known IP addresses.

### Password Security

- Use strong, randomly generated passwords (minimum 32 characters)
- Rotate database passwords regularly
- Never commit database credentials to version control
- Use environment variables for all sensitive data

### Backup and Recovery

#### Automated Backups
Configure automated backups based on your provider:

- **Vercel Postgres**: Automatic daily backups (retained for 7 days on Hobby plan)
- **Supabase**: Automatic daily backups with point-in-time recovery
- **Neon**: Automatic backups with branch-based development

#### Manual Backup
Create manual backups before major changes:

```bash
# Using pg_dump
pg_dump -h hostname -U username -d database_name -F c -b -v -f backup_file.dump

# Restore from backup
pg_restore -h hostname -U username -d database_name -v backup_file.dump
```

#### Test Recovery Procedures
Regularly test your backup restoration process to ensure data can be recovered.

### Monitoring and Logging

1. **Enable Query Logging** (development only):
   ```typescript
   // In prisma/schema.prisma or your Prisma client initialization
   const prisma = new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   });
   ```

2. **Monitor Connection Pool**: Track active connections to prevent exhaustion

3. **Set Up Alerts**: Configure alerts for:
   - High connection count
   - Slow queries
   - Failed login attempts
   - Disk space usage

### Data Protection

1. **Encryption at Rest**: Ensure your database provider encrypts data at rest
2. **Encryption in Transit**: Always use SSL/TLS (see Connection Security above)
3. **Sensitive Data**: 
   - Passwords are hashed using bcrypt (12 rounds)
   - OTP tokens expire after 15 minutes
   - Never log sensitive data

## 6. Performance Optimization

### Indexing
The Prisma schema includes automatic indexes on:
- Primary keys (`@id`)
- Unique fields (`@unique`)
- Foreign keys (relations)

For custom indexes, add to your schema:
```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  
  @@index([email]) // Custom index
}
```

### Query Optimization
- Use `select` to fetch only needed fields
- Use `include` wisely to avoid N+1 queries
- Implement pagination for large datasets

## 7. Troubleshooting

### Connection Issues
```
Error: P1001: Can't reach database server
```
**Solutions**:
- Check if database is running
- Verify connection string is correct
- Check firewall/IP whitelist settings
- Ensure SSL mode is correct

### Migration Issues
```
Error: P3009: migrate found failed migrations
```
**Solutions**:
- Run `npx prisma migrate reset` (⚠️ deletes all data)
- Or manually fix failed migrations in database

### Performance Issues
- Enable query logging to identify slow queries
- Check connection pool settings
- Consider adding indexes for frequently queried fields
- Use database provider's performance monitoring tools

## Additional Resources

- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Database Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#connection-pooling)

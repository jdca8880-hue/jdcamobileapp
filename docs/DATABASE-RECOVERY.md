# JDCA Database Disaster Recovery & Testing Guide

This document outlines the exact procedures to recover the JDCA database in the event of catastrophic data loss, or a deleted Supabase project.

It also includes instructions on how to perform a **Restore Test** periodically to guarantee backups are functional.

---

## 🛑 Important Caveats Before Starting

1. **Keepalive Limitations:** The daily GitHub action (`keepalive.yml`) provides *daily activity intended to prevent inactivity-based pausing*. It is **not** a 100% guarantee against pausing. However, if your project *is* paused (Scenario A), your data is not lost. You can simply click "Restore" in the Supabase Dashboard. You only need this disaster recovery guide for Scenarios B (deleted data) and C (deleted project).
2. **Supabase Storage is NOT backed up:** The automated `backup.yml` workflow *only* backs up the PostgreSQL database. It does **not** back up files stored in Supabase Storage buckets. (Since JDCA primarily uses Cloudinary for images, this is less of a concern, but must be noted).
3. **Connection String Types:** When retrieving your `SUPABASE_DB_URL`, Supabase offers two types: Session Pooler (`aws-0-...pooler.supabase.com`) and Direct Connection (`db.[PROJECT-REF].supabase.com`). For backups and restores using `psql` or the Supabase CLI, ensure you are using the connection string format that works best for your network (usually Direct Connection is preferred for CLI dumps if IPv4/IPv6 allows).

---

## Part 1: Disaster Recovery (Production Restore)

If the production Supabase database is completely lost, follow these steps to restore service.

### 1. Create a Replacement Supabase Project
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** and select your organization.
3. Name the project `JDCA-Production` (or similar).
4. Enter a strong database password and **save this password securely**.
5. Wait for the project to provision.

### 2. Obtain Connection String & Keys
1. Go to **Settings > Database**.
2. Scroll to **Connection string** and select the **URI** tab. 
3. Copy the string (it starts with `postgresql://`). Replace `[YOUR-PASSWORD]` with the password from step 1. This is your `SUPABASE_DB_URL`.
4. Go to **Settings > API**.
5. Copy the **Project URL** and the **`anon` `public` API Key**.

### 3. Download the JDCA Backup Artifact
1. Go to your JDCA repository on GitHub.
2. Click on the **Actions** tab.
3. Select the **Automated Database Backup** workflow.
4. Click on the most recent successful run.
5. Under **Artifacts** at the bottom, download the `jdca-database-backup-...` zip file.
6. Extract the zip file, and extract the `tar.gz` inside it to access `roles.sql`, `schema.sql`, and `data.sql`.

### 4. Restore the Database

Use the standard `psql` command-line tool to restore the files strictly in this order:

#### A. Restore Roles
```bash
psql "YOUR_SUPABASE_DB_URL" -f roles.sql
```
*(You may see warnings about existing Supabase default roles; these can safely be ignored).*

#### B. Restore Schema
```bash
psql "YOUR_SUPABASE_DB_URL" -f schema.sql
```

#### C. Restore Data
```bash
psql "YOUR_SUPABASE_DB_URL" -f data.sql
```

### 5. Re-enable Supabase Realtime (CRITICAL)
Supabase database dumps do *not* automatically reactivate Realtime publications for your tables.
1. In the Supabase Dashboard, go to **Database > Publications**.
2. Enable Realtime for the `matches` table (and any other tables relying on live sync).

### 6. Verify Database Integrity
1. Go to **Table Editor** and verify that `matches`, `deliveries`, and `profiles` contain data.
2. Go to **Authentication > Policies** and verify that the Row Level Security (RLS) policies are active on the tables.

### 7. Update Vercel Environment Variables
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Go to the JDCA project > **Settings > Environment Variables**.
3. Update the following values:
   * `VITE_SUPABASE_URL` -> (New Project URL)
   * `VITE_SUPABASE_ANON_KEY` -> (New Anon Key)
4. Go to GitHub **Settings > Secrets and variables > Actions** and update:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
   * `SUPABASE_DB_URL`

### 8. Redeploy JDCA
In Vercel, go to the **Deployments** tab and click **Redeploy** on the latest production build.

### 9. Final Verification
1. Open the live JDCA app.
2. Verify you can log in.
3. Verify that the Matches tab loads historical matches.
4. **Live Scoring Test:** Have a scorer log in, enter a delivery, and verify it broadcasts via Realtime.

---

## Part 2: Restore Test (Dry Run)

You must perform a dry run periodically to ensure the backups are not corrupted and this documentation is accurate.

**Do NOT touch the production Supabase project or Vercel during this test.**

### Procedure:
1. **Trigger a Backup:** Go to GitHub Actions -> **Automated Database Backup** -> **Run workflow**. Wait for it to finish and download the artifact.
2. **Create Temporary Project:** Supabase Free Tier allows 2 active free projects. Create a new project called `JDCA-DR-TEST`.
3. **Restore Backup:** Run the three `psql` commands against the `JDCA-DR-TEST` connection string as documented in Part 1 (Roles -> Schema -> Data). Remember to enable Realtime for the `matches` table.
4. **Local Verification:** 
   * On your local computer, open the JDCA codebase.
   * Modify your local `.env` file to point `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the `JDCA-DR-TEST` project.
   * Run `npm run dev`.
   * Verify:
     * ✓ Districts, players, teams, matches load.
     * ✓ RLS works (public can read, only scorers can write).
     * ✓ A scorer can login and enter a ball.
     * ✓ Live scoring (Realtime) works.
5. **Cleanup:** Delete the `JDCA-DR-TEST` project from Supabase. Revert your local `.env` to the production keys.

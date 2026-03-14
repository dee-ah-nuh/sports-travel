-- Enable row-level security extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Ensure the sports_travel role exists for RLS
-- In production this is handled by Supabase; locally we just ensure extensions are ready

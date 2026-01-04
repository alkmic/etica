-- Migration: Rename domain to sector and scale to userScale
-- This migration renames columns without losing data
-- Uses conditional logic to handle both fresh databases and existing ones

-- Rename domain column to sector in Sia table (if domain exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Sia' AND column_name = 'domain'
    ) THEN
        ALTER TABLE "Sia" RENAME COLUMN "domain" TO "sector";
    END IF;
END $$;

-- Rename scale column to userScale in Sia table (if scale exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Sia' AND column_name = 'scale'
    ) THEN
        ALTER TABLE "Sia" RENAME COLUMN "scale" TO "userScale";
    END IF;
END $$;

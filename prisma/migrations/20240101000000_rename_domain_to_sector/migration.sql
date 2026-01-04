-- Migration: Rename domain to sector and scale to userScale
-- This migration renames columns without losing data

-- Rename domain column to sector in Sia table
ALTER TABLE "Sia" RENAME COLUMN "domain" TO "sector";

-- Rename scale column to userScale in Sia table
ALTER TABLE "Sia" RENAME COLUMN "scale" TO "userScale";

-- Run this FIRST to clean up, then re-run schema.sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.jubah_bookings cascade;
drop table if exists public.rides cascade;
drop table if exists public.profiles cascade;

// lib/auth.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => createPagesServerClient({ cookies });
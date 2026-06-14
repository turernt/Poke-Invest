import { test as setup } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const STORAGE_PATH = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Log in via Supabase directly and inject session into browser storage
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.E2E_EMAIL!,
    password: process.env.E2E_PASSWORD!,
  });

  if (error || !data.session) throw new Error("Auth failed: " + error?.message);

  // Navigate to app and inject the session via localStorage
  await page.goto("/connexion");
  await page.evaluate(
    ({ session, url, key }) => {
      const storageKey = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
      localStorage.setItem(storageKey, JSON.stringify(session));
    },
    {
      session: data.session,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key: "",
    }
  );

  await page.context().storageState({ path: STORAGE_PATH });
});

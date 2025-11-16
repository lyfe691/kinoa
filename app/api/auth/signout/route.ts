import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    const status =
      typeof (error as { status?: number }).status === "number"
        ? (error as { status?: number }).status
        : 400;

    // Treat missing/expired sessions as already signed out
    if (status === 400 || status === 401) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ success: true });
}


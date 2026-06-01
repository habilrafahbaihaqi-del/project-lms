import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password");

  // Jika belum login dan mencoba masuk ke halaman rahasia, tendang ke login
  if (!user && !isAuthPage && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika SUDAH login, lakukan pengecekan ROLE
  if (user) {
    // Ambil role dari tabel profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    const role = profile?.role || "user";

    const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // Aturan untuk SUPER ADMIN
    if (role === "super_admin") {
      // Jika Super Admin mencoba buka halaman login/register ATAU dashboard user biasa
      if (isAuthPage || isDashboardPage || request.nextUrl.pathname === "/") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }

    // Aturan untuk USER BIASA
    if (role === "user") {
      // Jika User biasa mencoba buka halaman login/register ATAU halaman admin
      if (isAuthPage || isAdminPage || request.nextUrl.pathname === "/") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "junta_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/receitas",
  "/despesas",
  "/categorias",
  "/metas",
  "/orcamento",
  "/assinaturas",
  "/analise",
  "/configuracoes",
  "/perfil",
  "/relatorio",
  "/onboarding",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const valid = await hasValidSession(req);
  if (valid) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/receitas/:path*",
    "/despesas/:path*",
    "/categorias/:path*",
    "/metas/:path*",
    "/orcamento/:path*",
    "/assinaturas/:path*",
    "/analise/:path*",
    "/configuracoes/:path*",
    "/perfil/:path*",
    "/relatorio/:path*",
    "/onboarding/:path*",
  ],
};

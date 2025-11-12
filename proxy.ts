import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getUidFromApiKey, hashApiKey } from "./lib/database/client";

export interface AuthRequest extends NextRequest {
    uid?: string;
}

const parsePathname = (pathname: string) => {
    const localeRegex = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
    const match = pathname.match(localeRegex);
    let route =
        pathname.replace(localeRegex, "").split("?")[0].replace(/\/+$/, "") ||
        "/";
    if (!route.startsWith("/")) {
        route = "/" + route;
    }
    return {
        locale: match?.[1] ?? routing.defaultLocale ?? "fr",
        route,
    };
};

const Unauthorized = () => {
    return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
    );
};

const i18n = createMiddleware(routing);
const NOT_TRANSLATE = ["/api"];
const PROTECTED = ["/api", "/dashboard"];
const AUTH_PAGES = ["/login", "/register"];
const VALID_ROUTES = [
    "/",
    "/dashboard",
    "/login",
    "/register",
    "/api",
    "/auth/login",
    "/auth/logout",
    "/auth/refresh",
];

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const { locale, route } = parsePathname(pathname);
    const session = req.cookies.get("session")?.value;
    let authorized = !!session;

    if (!VALID_ROUTES.includes(route)) {
        return NextResponse.redirect(new URL(`/${locale}/`, req.url));
    }

    // Vérifier l'authentification pour TOUTES les routes (pas seulement protégées)
    // afin de pouvoir rediriger /login → /dashboard si connecté
    const apiKey = req.headers.get("authorization")?.split("Bearer ")[1];

    // Fallback sur API key si pas de session valide
    if (!authorized && apiKey) {
        const apiKeyUid = await getUidFromApiKey(await hashApiKey(apiKey));
        if (apiKeyUid) {
            authorized = true;
        } else {
            // API key invalide sur route protégée
            if (PROTECTED.some((p) => route.startsWith(p))) {
                return Unauthorized();
            }
        }
    }

    // Si route protégée et pas autorisé, bloquer
    if (PROTECTED.some((p) => route.startsWith(p)) && !authorized) {
        if (NOT_TRANSLATE.some((p) => route.startsWith(p))) {
            return Unauthorized();
        }
        // Sinon rediriger vers login (géré plus bas)
    }

    // Page à ne pas traduire
    if (
        NOT_TRANSLATE.some(
            (p) =>
                route.startsWith(p) &&
                !PROTECTED.some((p) => route.startsWith(p))
        )
    ) {
        return NextResponse.next();
    } else if (
        NOT_TRANSLATE.some(
            (p) =>
                route.startsWith(p) &&
                PROTECTED.some((p) => route.startsWith(p))
        )
    ) {
        if (authorized) {
            return NextResponse.next();
        } else {
            return Unauthorized();
        }
    }

    // Page protégée avec traduction
    if (authorized) {
        if (AUTH_PAGES.some((p) => route.startsWith(p))) {
            // Rewrite vers dashboard au lieu de redirect pour que le client navigue
            const url = new URL(`/${locale}/dashboard`, req.url);
            return NextResponse.redirect(url);
        }
        return i18n(req);
    } else {
        if (PROTECTED.some((p) => route.startsWith(p))) {
            const url = new URL(`/${locale}/login`, req.url);
            return NextResponse.redirect(url);
        } else {
            return i18n(req);
        }
    }
}

export const config = {
    // Exclut /auth/* pour éviter les redirections infinies lors de login/logout/refresh
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*|auth/login|auth/logout|auth/refresh).*)",
    ],
};

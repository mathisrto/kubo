import { admin } from "@/lib/firebase/server";
import { NextRequest, NextResponse } from "next/server";

// Supprime correctement le cookie de session et révoque le token Firebase
export async function POST(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const res = NextResponse.json({ ok: true });

    // 1. Suppression du cookie (mêmes attributs que lors de la création)
    res.cookies.set({
        name: "session",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    res.cookies.set({
        name: "uid",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    // 2. Optionnel : révoquer les refresh tokens Firebase pour invalider toute session persistante
    if (session) {
        try {
            const decoded = await admin
                .auth()
                .verifySessionCookie(session, true);
            if (decoded?.sub) {
                await admin.auth().revokeRefreshTokens(decoded.sub);
            }
        } catch (_) {
            // Silencieux: si le cookie est déjà invalide on ignore
        }
    }

    return res;
}

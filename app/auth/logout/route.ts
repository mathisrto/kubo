import { admin } from "@/src/firebase/server";
import { getUidFromSessionCookie } from "@/src/helpers";
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

    // 2. Optionnel : révoquer les refresh tokens Firebase pour invalider toute session persistante
    if (session) {
        try {
            const uid = await getUidFromSessionCookie(session);
            if (uid) {
                await admin.auth().revokeRefreshTokens(uid);
            }
        } catch (_) {
            // Silencieux: si le cookie est déjà invalide on ignore
        }
    }

    return res;
}

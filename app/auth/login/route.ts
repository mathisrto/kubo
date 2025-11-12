import { admin } from "@/lib/firebase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken || typeof idToken !== "string") {
            return NextResponse.json(
                { ok: false, error: "idToken manquant" },
                { status: 400 }
            );
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (!decodedToken || !decodedToken.uid) {
            return NextResponse.json(
                { ok: false, error: "Invalid idToken" },
                { status: 400 }
            );
        }

        const uid = decodedToken.uid;

        const maxAge = 14 * 24 * 60 * 60;
        const sessionCookie = await admin
            .auth()
            .createSessionCookie(idToken, { expiresIn: maxAge * 1000 });

        const res = NextResponse.json({ ok: true });
        res.cookies.set({
            name: "session",
            value: sessionCookie,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge,
        });

        res.cookies.set({
            name: "uid",
            value: uid,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge,
        });

        return res;
    } catch (e) {
        console.error("Error during login:", e);
        return NextResponse.json(
            { ok: false, error: "requête JSON invalide" },
            { status: 400 }
        );
    }
}

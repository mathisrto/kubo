import { admin } from "@/lib/firebase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const cookie = req.cookies.get("session")?.value || null;

    console.log("Received session cookie:", cookie);

    if (!cookie) {
        return new Response(
            JSON.stringify({ ok: false, error: "No session cookie found" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const decoded = await admin.auth().verifySessionCookie(cookie, true);

        if (!decoded || !decoded.uid) {
            return new Response(
                JSON.stringify({ ok: false, error: "Invalid session cookie" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const customToken = await admin.auth().createCustomToken(decoded.uid);

        return new Response(JSON.stringify({ ok: true, customToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ ok: false, error: "Failed to refresh token" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

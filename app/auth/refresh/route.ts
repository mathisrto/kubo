import { admin } from "@/lib/firebase/server";
import { getUidFromSessionCookie } from "@/lib/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const cookie = req.cookies.get("session")?.value || null;

    if (!cookie) {
        return new Response(
            JSON.stringify({ ok: false, error: "No session cookie found" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const uid = await getUidFromSessionCookie(cookie);

        if (!uid) {
            return new Response(
                JSON.stringify({ ok: false, error: "Invalid session cookie" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        const customToken = await admin.auth().createCustomToken(uid);

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

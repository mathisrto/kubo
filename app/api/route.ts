import server from "@/lib/database/graphql/server";
import { AuthRequest } from "@/proxy";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const handler = startServerAndCreateNextHandler(server, {
    context: async (req: AuthRequest) => {
        const uid = req.headers.get("x-uid") || null;
        return { uid };
    },
});

export async function POST(req: AuthRequest) {
    return handler(req);
}

export async function GET(req: AuthRequest) {
    return handler(req);
}

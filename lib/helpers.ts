export function requireAuth<P = unknown, A = unknown, R = unknown>(
    resolverFn: (
        parent: P,
        args: A,
        context: { uid: string },
        info: unknown
    ) => R
) {
    return (parent: P, args: A, context: { uid: string }, info: unknown): R => {
        if (!context.uid) {
            throw new Error("⛔ Non authentifié");
        }
        return resolverFn(parent, args, context, info);
    };
}

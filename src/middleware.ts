import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware((auth, request, event) => {
    // Check if the route is protected
    if (isProtectedRoute(request)) {
        const { sessionId } = auth();

        // If sessionId is not present, return a 401 Unauthorized response
        if (!sessionId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
    }

});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
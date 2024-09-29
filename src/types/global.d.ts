export { }

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            maximum_urls?: number
        }
    }
}
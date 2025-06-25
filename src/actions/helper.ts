import { domainName } from "@/config"

const getCookieLife = () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)

export const J_S = new TextEncoder().encode(process.env.JWT_SECRET)

// Cookie Config
export const getCookieConfig = () => ({
    httpOnly: true,
    sameSite: "strict" as const,
    domain: process.env.NODE_ENV === "production" ?
        ".pranaair.com"
        : undefined,
    expires: getCookieLife(),
    secure: process.env.NODE_ENV === "production",
})
"use server"

import { conventions, domainName, regexChecks } from "@/config"
import { AdminInfo, TypeAction } from "@/types"
import log from "@/utils/log"
import { cookies } from "next/headers"
import * as jose from "jose"
import { getCookieConfig, J_S } from "./helper"

type Args = {
    email: string
    password: string
}

const logMeIn = async (args: Args): Promise<TypeAction> => {
    try {
        // If invalid email
        if (!regexChecks.email.test(args.email) || !regexChecks.password.test(args.password)) {
            throw new Error("Invalid email or password found")
        }

        // Login user
        const response: { status: string, message: string, token?: string, email?: string } = await (await fetch("https://myserver.aqi.in/pranaAir/loginCustomer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: args.email,
                password: args.password,
            }),
        })).json();

        // If not logged in
        if (!response?.token || !response?.email) {
            throw new Error(response.message || "Email or Password is incorrect")
        }

        // Set user Info cookie
        const payload: AdminInfo = {
            email: response.email,
            token: response.token,
            loggedInAt: new Date().toISOString(),
        }

        // Cookies
        const cookie = await cookies();

        // Sign a JWT token
        // JWT Algo
        const alg = 'HS256'
        // Sign JWT
        const signedUserInfo = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(J_S)

        // Set the token in Cookie
        cookie.set(
            conventions.cookie.adminInfo,
            signedUserInfo,
            {
                ...getCookieConfig()
            }
        )

        // Return
        return {
            status: true,
            message: "Login successfully",
        }

        // Error
    } catch (error: any) {
        // Log
        log("error", "ERROR IN LOG_ME_IN ACTION", error)
        return {
            status: false,
            message: error?.message ?? "Something went wrong",
        }
    }
}

export default logMeIn
"use server"

import { TypeAction } from "@/types";
import { cookies } from "next/headers";
import log from "@/utils/log";
import { conventions } from "@/config";
import { getCookieConfig } from "./helper";

const logMeOut = async (): Promise<TypeAction> => {
    try {

        // Cookie
        const cookieStore = await cookies();

        cookieStore.set(conventions.cookie.adminInfo, "", {
            ...getCookieConfig(),
            maxAge: 0,
        });

        // Return Action Response
        return {
            status: true,
            message: "Logged out successfully"
        }

    } catch (error) {
        log("error", "Error while logging out", error)
        return {
            status: false,
            message: "Something went wrong"
        }
    }
}

export default logMeOut
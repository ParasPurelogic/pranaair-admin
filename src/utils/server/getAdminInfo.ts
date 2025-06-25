import { cookies } from "next/headers";
import { cache } from "react";
import { jwtVerify } from "jose";

import { conventions } from "@/config";
import { AdminInfo } from "@/types";
import { J_S } from "@/actions/helper";

const getAdminInfo = cache(
    async (): Promise<AdminInfo | null> => {
        try {
            // 1 — Grab the raw cookie
            const token = (await cookies())
                ?.get(conventions.cookie.adminInfo)
                ?.value;

            if (!token) return null;

            // 2 — Verify signature *and* standard claims
            const { payload } = await jwtVerify<AdminInfo>(
                token,
                J_S,
                {
                    algorithms: ["HS256"],
                },
            );

            // 3 — At this point the token is authentic & unexpired.
            return payload;
        } catch (error) {
            return null;
        }
    },
);

export default getAdminInfo;

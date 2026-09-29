import { NextResponse } from "next/server";

export function setAuthCookie(res: NextResponse, data: string, name: string) {

    res.cookies.set({
        name: name,
        value: data,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

}
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export default async function middleware(request: NextRequest) {
	const session = await auth();

	if (!session) {
		return NextResponse.redirect(`${process.env.VERCEL_URL}`);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/Semester/:path*",
		"/news/:path*",
		"/links/:path*",
		"/comments/:path*",
		"/secret/:path*",
	],
};

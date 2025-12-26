import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    if (!body || typeof body.password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (body.password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

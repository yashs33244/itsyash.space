import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password !== UPLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 403 }
      );
    }

    // Generate JWT token valid for 30 days
    const token = jwt.sign(
      { authorized: true },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresIn: "30d",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

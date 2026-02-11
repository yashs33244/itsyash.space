import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    R2_METADATA_KEY: process.env.R2_METADATA_KEY,
    R2_METADATA_KEY_LENGTH: process.env.R2_METADATA_KEY?.length,
    R2_METADATA_KEY_BYTES: Buffer.from(process.env.R2_METADATA_KEY || "").toString('hex'),
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? "SET" : "NOT SET",
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? "SET" : "NOT SET",
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? "SET" : "NOT SET",
  });
}

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "yashs3324";
const R2_UPLOAD_PREFIX = process.env.R2_UPLOAD_PREFIX || "photos";
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

function getR2Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 credentials not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

function getPublicUrl(key: string) {
  if (R2_PUBLIC_BASE_URL) {
    return `${R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }

  if (!R2_ACCOUNT_ID) {
    return key;
  }

  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
}

export async function POST(request: NextRequest) {
  if (!UPLOAD_PASSWORD) {
    return NextResponse.json(
      { error: "Upload password not configured" },
      { status: 500 }
    );
  }

  // Check for JWT token first
  const token = request.headers.get("x-upload-token");
  const password = request.headers.get("x-upload-password");

  if (token) {
    // Verify JWT token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } else if (password) {
    // Fallback to password authentication
    if (password !== UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 403 });
    }
  } else {
    return NextResponse.json(
      { error: "Unauthorized - token or password required" },
      { status: 401 }
    );
  }

  try {
    // Get the raw body as ArrayBuffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Removed file size limit - R2 will handle it
    console.log("[Upload] Received file of size:", buffer.length, "bytes");

    // Get metadata from headers
    const encodedFileName = request.headers.get("x-file-name") || "upload.jpg";
    const fileType = request.headers.get("content-type") || "image/jpeg";

    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Decode filename from base64
    let fileName = "upload.jpg";
    try {
      fileName = decodeURIComponent(Buffer.from(encodedFileName, "base64").toString());
    } catch (e) {
      // If decoding fails, use as-is (for backward compatibility)
      fileName = encodedFileName;
    }

    const timestamp = Date.now();
    const originalName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
    const filename = `${timestamp}-${originalName}`;
    const key = `${R2_UPLOAD_PREFIX}/${filename}`;

    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: fileType,
      })
    );

    const url = getPublicUrl(key);

    return NextResponse.json({
      success: true,
      filename,
      path: key,
      url,
      size: buffer.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

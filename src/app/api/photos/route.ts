import { NextRequest, NextResponse } from "next/server";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "yashs3324";
const R2_METADATA_KEY =
  process.env.R2_METADATA_KEY || "photos/photos.json";

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  location?: string;
  camera?: string;
  aperture?: string; // e.g., "f/2.8"
  iso?: string; // e.g., "400"
  shutterSpeed?: string; // e.g., "1/250"
  date?: string; // ISO date format from date picker
  category: string; // Now accepts any custom category
}

interface PhotoSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundUrl?: string;
  heroTint?: string;
  pageBackground?: string;
  homepageHeroBackground?: string; // For "Yash Singh" section
  photographyHeroBackground?: string; // For photography page hero
  categoryHeroPhotos?: Record<string, string>; // Hero photo URL for each category
}

interface PhotoPayload {
  photos: Photo[];
  settings: PhotoSettings;
  categories: string[]; // Dynamic categories
  updatedAt?: string;
  debug?: {
    error?: string;
    bucket?: string;
    key?: string;
  };
}

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

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized - password required" },
    { status: 401 }
  );
}

function forbiddenResponse() {
  return NextResponse.json({ error: "Invalid password" }, { status: 403 });
}

function requireAuth(request: NextRequest) {
  if (!UPLOAD_PASSWORD) {
    return NextResponse.json(
      { error: "Upload password not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse();
  }

  const providedPassword = authHeader.replace("Bearer ", "");
  if (providedPassword !== UPLOAD_PASSWORD) {
    return forbiddenResponse();
  }

  return null;
}

async function streamToString(stream: ReadableStream | Blob | null) {
  if (!stream) return "";
  if (stream instanceof Blob) {
    return await stream.text();
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (result.value) {
      chunks.push(result.value);
    }
  }

  return new TextDecoder().decode(Buffer.concat(chunks));
}

async function readPhotosFile(): Promise<PhotoPayload> {
  const client = getR2Client();

  try {
    console.log("[readPhotosFile] Reading from R2:", {
      bucket: R2_BUCKET_NAME,
      key: R2_METADATA_KEY,
    });

    const response = await client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: R2_METADATA_KEY,
      })
    );

    const body = await streamToString(response.Body as ReadableStream | Blob);
    console.log("[readPhotosFile] Got data from R2, length:", body.length);
    
    const data = JSON.parse(body) as PhotoPayload;
    console.log("[readPhotosFile] Parsed data:", {
      photoCount: data.photos?.length,
      categories: data.categories?.length,
    });
    
    // Ensure categories exist with defaults
    if (!data.categories) {
      data.categories = ["landscape", "portrait", "street", "nature", "urban"];
    }
    
    return data;
  } catch (error) {
    console.error("[readPhotosFile] Error reading from R2:", error);
    console.error("[readPhotosFile] Bucket:", R2_BUCKET_NAME, "Key:", R2_METADATA_KEY);
    console.error("[readPhotosFile] Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any).Code,
      statusCode: (error as any).$metadata?.httpStatusCode,
    });
    
    // File doesn't exist yet - return empty structure
    return { 
      photos: [], 
      settings: {},
      categories: ["landscape", "portrait", "street", "nature", "urban"],
      debug: {
        error: error instanceof Error ? error.message : String(error),
        bucket: R2_BUCKET_NAME,
        key: R2_METADATA_KEY,
      }
    };
  }
}

async function writePhotosFile(data: PhotoPayload) {
  const client = getR2Client();

  try {
    console.log("[writePhotosFile] Writing to R2:", {
      bucket: R2_BUCKET_NAME,
      key: R2_METADATA_KEY,
      photoCount: data.photos?.length,
      categories: data.categories,
    });

    const result = await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: R2_METADATA_KEY,
        Body: Buffer.from(JSON.stringify(data, null, 2)),
        ContentType: "application/json",
      })
    );

    console.log("[writePhotosFile] Successfully wrote to R2:", result);
  } catch (error) {
    console.error("[writePhotosFile] Error writing to R2:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await readPhotosFile();
    console.log("[GET /api/photos] Returning data:", { photoCount: data.photos?.length });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/photos] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const { photo } = (await request.json()) as { photo: Photo };
    console.log("[POST /api/photos] Received photo:", photo);
    
    if (!photo?.url || !photo?.title) {
      console.error("[POST /api/photos] Missing required fields:", { url: photo?.url, title: photo?.title });
      return NextResponse.json(
        { error: "Photo url and title are required" },
        { status: 400 }
      );
    }

    const data = await readPhotosFile();
    console.log("[POST /api/photos] Current data:", { photoCount: data.photos?.length, categories: data.categories });
    
    const newPhoto: Photo = {
      ...photo,
      id: photo.id || crypto.randomUUID(),
    };

    // Add category if it doesn't exist
    let updatedCategories = data.categories || [];
    if (photo.category && !updatedCategories.includes(photo.category)) {
      updatedCategories.push(photo.category);
    }

    const updated: PhotoPayload = {
      ...data,
      photos: [newPhoto, ...(data.photos || [])],
      categories: updatedCategories,
      updatedAt: new Date().toISOString(),
    };

    console.log("[POST /api/photos] Writing updated data:", { photoCount: updated.photos.length, categories: updated.categories });
    await writePhotosFile(updated);
    console.log("[POST /api/photos] Successfully saved photo");
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[POST /api/photos] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save photo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      photo?: Photo;
      settings?: PhotoSettings;
      categories?: string[];
      addCategory?: string;
      deleteCategory?: string;
    };

    const data = await readPhotosFile();
    let updatedPhotos = data.photos || [];
    let updatedCategories = data.categories || [];

    if (body.photo) {
      updatedPhotos = updatedPhotos.map((item) =>
        item.id === body.photo?.id ? { ...item, ...body.photo } : item
      );
    }

    // Add new category
    if (body.addCategory && !updatedCategories.includes(body.addCategory)) {
      updatedCategories.push(body.addCategory);
    }

    // Delete category
    if (body.deleteCategory) {
      updatedCategories = updatedCategories.filter(c => c !== body.deleteCategory);
    }

    // Replace all categories
    if (body.categories) {
      updatedCategories = body.categories;
    }

    const updated: PhotoPayload = {
      photos: updatedPhotos,
      settings: { ...data.settings, ...body.settings },
      categories: updatedCategories,
      updatedAt: new Date().toISOString(),
    };

    await writePhotosFile(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = (await request.json()) as { id: string };
    if (!id) {
      return NextResponse.json({ error: "Photo id required" }, { status: 400 });
    }

    const data = await readPhotosFile();
    const updated: PhotoPayload = {
      ...data,
      photos: (data.photos || []).filter((photo) => photo.id !== id),
      categories: data.categories || [],
      updatedAt: new Date().toISOString(),
    };

    await writePhotosFile(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500 }
    );
  }
}

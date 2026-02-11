const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config({ path: '.env.production' });

async function testR2Read() {
  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
  const R2_METADATA_KEY = process.env.R2_METADATA_KEY?.trim() || "photos/photos.json";

  console.log("Config:", {
    R2_ACCOUNT_ID,
    R2_BUCKET_NAME,
    R2_METADATA_KEY,
    R2_METADATA_KEY_length: R2_METADATA_KEY.length,
    R2_ACCESS_KEY_ID: R2_ACCESS_KEY_ID ? "SET" : "NOT SET",
  });

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    console.log("\nAttempting to read from R2...");
    const response = await client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: R2_METADATA_KEY,
      })
    );

    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString("utf-8");
    
    console.log("SUCCESS! Read", body.length, "bytes");
    const data = JSON.parse(body);
    console.log("Photo count:", data.photos?.length);
    console.log("Categories:", data.categories);
  } catch (error) {
    console.error("ERROR:", error.message);
    console.error("Error code:", error.Code);
    console.error("Error name:", error.name);
  }
}

testR2Read();

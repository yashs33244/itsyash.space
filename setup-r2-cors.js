#!/usr/bin/env node

/**
 * Script to configure CORS for R2 bucket
 * This allows direct uploads from the browser to R2
 */

const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');

// Read .env.production file
const envPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '').trim();
      process.env[key.trim()] = value;
    }
  });
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "yashs3324";

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Missing R2 credentials in .env.production');
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function setupCors() {
  console.log('🔧 Setting up CORS for R2 bucket:', R2_BUCKET_NAME);
  
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedOrigins: [
          'https://itsyash.space',
          'http://localhost:3000',
          'https://*.vercel.app'
        ],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedHeaders: ['*'],
        ExposeHeaders: [
          'ETag',
          'Content-Length',
          'Content-Type',
          'x-amz-request-id',
          'x-amz-id-2'
        ],
        MaxAgeSeconds: 3600,
      },
    ],
  };

  try {
    // Set CORS
    await client.send(
      new PutBucketCorsCommand({
        Bucket: R2_BUCKET_NAME,
        CORSConfiguration: corsConfiguration,
      })
    );

    console.log('✅ CORS configuration applied successfully!');
    
    // Verify CORS
    console.log('\n📋 Verifying CORS configuration...');
    const corsResult = await client.send(
      new GetBucketCorsCommand({
        Bucket: R2_BUCKET_NAME,
      })
    );

    console.log('\n✅ Current CORS configuration:');
    console.log(JSON.stringify(corsResult.CORSRules, null, 2));
    
    console.log('\n✅ CORS setup complete!');
    console.log('You can now upload files directly from the browser to R2.');
    
  } catch (error) {
    console.error('❌ Error setting up CORS:', error.message);
    process.exit(1);
  }
}

setupCors();

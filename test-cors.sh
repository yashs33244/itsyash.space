#!/bin/bash
echo "Testing CORS configuration for R2 bucket..."
echo ""
echo "Testing OPTIONS request (CORS preflight)..."

curl -i -X OPTIONS \
  -H "Origin: https://itsyash.space" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type" \
  "https://yashs3324.341456ef6cdad50a32d23cc63d4f5eb6.r2.cloudflarestorage.com/photos/test.jpg" 2>&1 | head -20

echo ""
echo "---"
echo "If you see 'Access-Control-Allow-Origin: https://itsyash.space' above, CORS is working!"
echo "If you see 403 or no Access-Control headers, CORS needs to be updated."

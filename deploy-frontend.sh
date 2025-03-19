#!/bin/bash

# Configuration
SERVER_IP="65.109.156.106"
SERVER_USER="root"
APP_DIR="/var/www/imran-khan-vote"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Build the frontend
echo "Building the frontend application..."
cd "$FRONTEND_DIR" && npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

echo "Build successful. Deploying to server..."

# Deploy to server
echo "Uploading build files to server..."
scp -r "$FRONTEND_DIR/dist/"* $SERVER_USER@$SERVER_IP:$APP_DIR/

# Check if upload was successful
if [ $? -ne 0 ]; then
  echo "Upload failed. Please check your server connection."
  exit 1
fi

echo "Deployment complete! Your updated application is now live at https://pmimrankhan.xyz"

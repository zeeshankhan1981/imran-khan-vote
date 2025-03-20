#!/bin/bash

# Configuration
SERVER_IP="65.109.156.106"
SERVER_USER="root"
APP_DIR="/var/www/imran-khan-vote"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKUP_DIR="/var/backups/imran-khan-vote"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Build the frontend
echo "Building the frontend application..."
cd "$FRONTEND_DIR" && npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

echo "Build successful. Deploying to server..."

# Create backup of current production files
echo "Creating backup of current production files..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $BACKUP_DIR && tar -czf $BACKUP_DIR/backup-$TIMESTAMP.tar.gz -C /var/www imran-khan-vote"

# Deploy to server
echo "Uploading build files to server..."
scp -r "$FRONTEND_DIR/dist/"* $SERVER_USER@$SERVER_IP:$APP_DIR/

# Check if upload was successful
if [ $? -ne 0 ]; then
  echo "Upload failed. Please check your server connection."
  exit 1
fi

# Restore configuration files
echo "Restoring configuration files..."
ssh $SERVER_USER@$SERVER_IP "cp -a /tmp/config-restore/imran-khan-vote/{deploy-config.json,imran-khan-vote.conf,how-to-access.html,unstoppable-domain-guide.html} $APP_DIR/ 2>/dev/null || echo 'Some config files not found, continuing...'"

echo "Deployment complete! Your updated application is now live at https://pmimrankhan.xyz"
echo "This version requires wallet connection for voting to ensure vote integrity."

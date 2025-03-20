#!/bin/bash

# Imran Khan Vote dApp Production Deployment Script
# This script deploys the application to the production server

echo "=== Imran Khan Vote dApp Production Deployment ==="
echo "Deploying to server: 95.216.25.234"
echo "Application path: /var/www/imran-khan-vote"

# Check if frontend is built
if [ ! -d "frontend/dist" ]; then
  echo "Error: Frontend build not found. Please run 'cd frontend && npm run build' first."
  exit 1
fi

# Create a temporary deployment package
echo "Creating deployment package..."
DEPLOY_PACKAGE="imran-khan-vote-deploy-$(date +%Y%m%d%H%M%S).tar.gz"
tar -czf $DEPLOY_PACKAGE \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude="frontend/node_modules" \
  frontend/dist \
  contracts \
  deploy \
  scripts \
  README.md \
  DEPLOYMENT_RECORD.md

echo "Deployment package created: $DEPLOY_PACKAGE"

# Upload to server
echo "Uploading to server..."
scp $DEPLOY_PACKAGE echoesofstreet:/tmp/

# Execute deployment commands on server
echo "Deploying on server..."
ssh echoesofstreet << 'EOF'
  # Extract the deployment package
  LATEST_PACKAGE=$(ls -t /tmp/imran-khan-vote-deploy-*.tar.gz | head -n 1)
  echo "Using package: $LATEST_PACKAGE"
  
  # Backup current deployment
  BACKUP_DIR="/var/www/backups/imran-khan-vote-$(date +%Y%m%d%H%M%S)"
  echo "Creating backup at $BACKUP_DIR"
  mkdir -p $BACKUP_DIR
  if [ -d "/var/www/imran-khan-vote" ]; then
    cp -r /var/www/imran-khan-vote/* $BACKUP_DIR/
  fi
  
  # Deploy new version
  echo "Deploying new version..."
  mkdir -p /var/www/imran-khan-vote
  tar -xzf $LATEST_PACKAGE -C /var/www/imran-khan-vote --strip-components=0
  
  # Move frontend files to the right location
  echo "Setting up frontend files..."
  rm -rf /var/www/imran-khan-vote/public/*
  cp -r /var/www/imran-khan-vote/frontend/dist/* /var/www/imran-khan-vote/public/
  
  # Set permissions
  echo "Setting permissions..."
  chown -R www-data:www-data /var/www/imran-khan-vote
  chmod -R 755 /var/www/imran-khan-vote
  
  # Restart web server if needed
  echo "Restarting web server..."
  systemctl restart nginx
  
  # Clean up
  echo "Cleaning up..."
  rm $LATEST_PACKAGE
EOF

# Clean up local deployment package
echo "Cleaning up local deployment package..."
rm $DEPLOY_PACKAGE

echo "=== Deployment Complete ==="
echo "The application should now be accessible at:"
echo "- http://pmimrankhan.xyz"
echo "- http://65.109.156.106"
echo "- https://pmimrankhan.unstoppable.link"

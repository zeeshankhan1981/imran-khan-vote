#!/bin/bash

# Build the frontend
cd frontend
npm run build
cd ..

# Create deployment directory
mkdir -p deploy

# Copy frontend build files
cp -r frontend/dist/* deploy/

# Create a deployment configuration file
cat > deploy/deploy-config.json << EOL
{
  "contractAddress": "0x52d3778ffbB1024b44D55214b3385e1e0F7A1354",
  "network": "mainnet",
  "deployedAt": "$(date)"
}
EOL

# Create an nginx configuration file
cat > deploy/imran-khan-vote.conf << EOL
server {
    listen 80;
    server_name vote.imrankhan.pk;  # Replace with your domain

    root /var/www/imran-khan-vote;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOL

echo "Deployment package created in the deploy directory"
echo "Next steps:"
echo "1. Upload the deploy directory to your server"
echo "2. Install nginx on your server if not already installed"
echo "3. Copy the nginx configuration to /etc/nginx/sites-available/"
echo "4. Create a symbolic link to /etc/nginx/sites-enabled/"
echo "5. Reload nginx"

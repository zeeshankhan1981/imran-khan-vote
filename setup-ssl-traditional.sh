#!/bin/bash

# This script sets up SSL certificates for your traditional domain
# Replace yourdomain.com with your actual domain

# Install Certbot
ssh baremetal "sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx"

# Get SSL certificate
ssh baremetal "sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com --non-interactive --agree-tos --email your-email@example.com"

# Verify Nginx configuration
ssh baremetal "sudo nginx -t && sudo systemctl restart nginx"

echo "SSL certificate has been set up for your domain"
echo "Your website is now accessible via https://yourdomain.com"

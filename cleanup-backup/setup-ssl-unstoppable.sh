#!/bin/bash

# This script sets up SSL certificates for your Unstoppable Domain
# Replace yourdomain.crypto with your actual domain

# Install Certbot
ssh baremetal "sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx"

# Get SSL certificate
ssh baremetal "sudo certbot --nginx -d yourdomain.crypto --non-interactive --agree-tos --email your-email@example.com"

# Verify Nginx configuration
ssh baremetal "sudo nginx -t && sudo systemctl restart nginx"

echo "SSL certificate has been set up for your Unstoppable Domain"
echo "Note: You may need to modify this script if your domain provider has specific requirements"

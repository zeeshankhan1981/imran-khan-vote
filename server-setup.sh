#!/bin/bash

# Update system packages
sudo apt update
sudo apt upgrade -y

# Install nginx
sudo apt install -y nginx

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Create directory for the application
sudo mkdir -p /var/www/imran-khan-vote

# Set proper permissions
sudo chown -R $USER:$USER /var/www/imran-khan-vote

# Copy the nginx configuration
sudo cp imran-khan-vote.conf /etc/nginx/sites-available/

# Create a symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/imran-khan-vote.conf /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Set up SSL (uncomment and replace with your domain when ready)
# sudo certbot --nginx -d vote.imrankhan.pk

echo "Server setup complete!"

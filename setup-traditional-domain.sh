#!/bin/bash

# Configuration
SERVER_IP="65.109.156.106"
SERVER_USER="root"  # Change this if you're using a different user
DOMAIN="pmimrankhan.xyz"
CONFIG_FILE="pmimrankhan-xyz.conf"
APP_DIR="/var/www/imran-khan-vote"

# Upload Nginx configuration
echo "Uploading Nginx configuration..."
scp $CONFIG_FILE $SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/$DOMAIN

# SSH into the server and set up the domain
echo "Setting up the domain on the server..."
ssh $SERVER_USER@$SERVER_IP << EOF
    # Create symbolic link to enable the site
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

    # Test Nginx configuration
    nginx -t

    # Reload Nginx to apply changes
    systemctl reload nginx

    # Set up SSL certificate (optional)
    read -p "Do you want to set up SSL with Let's Encrypt? (y/n) " setup_ssl
    if [ "\$setup_ssl" = "y" ]; then
        # Install Certbot if not already installed
        if ! command -v certbot &> /dev/null; then
            apt update
            apt install -y certbot python3-certbot-nginx
        fi

        # Obtain SSL certificate
        certbot --nginx -d $DOMAIN -d www.$DOMAIN

        # Reload Nginx again after SSL setup
        systemctl reload nginx
    fi

    echo "Domain setup complete!"
EOF

echo "Configuration complete! Your site should now be accessible at http://$DOMAIN"
echo "Note: DNS changes may take up to 24-48 hours to propagate globally."

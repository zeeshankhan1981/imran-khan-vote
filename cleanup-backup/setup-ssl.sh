#!/bin/bash

# Configuration
SERVER_IP="65.109.156.106"
SERVER_USER="root"  # Change this if you're using a different user
DOMAIN="pmimrankhan.xyz"
EMAIL="zeeshankhan1981@gmail.com"  # Using a standard Gmail address based on your GitHub username

# SSH into the server and set up SSL
echo "Setting up SSL certificate for $DOMAIN..."
ssh $SERVER_USER@$SERVER_IP << EOF
    # Install Certbot if not already installed
    if ! command -v certbot &> /dev/null; then
        apt update
        apt install -y certbot python3-certbot-nginx
    fi

    # Obtain SSL certificate
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

    # Reload Nginx
    systemctl reload nginx

    echo "SSL setup complete!"
EOF

echo "SSL configuration complete! Your site should now be accessible at https://$DOMAIN"

#!/bin/bash

# Replace these variables with your actual values
WEB3_DOMAIN="yourdomain.crypto"
SERVER_IP="65.109.156.106"
EMAIL="your-email@example.com"

echo "Setting up $WEB3_DOMAIN on your baremetal server"

# 1. Update the Nginx configuration
cat > web3-domain-config.conf << EOL
server {
    listen 80;
    listen [::]:80;
    
    server_name $WEB3_DOMAIN;
    
    root /var/www/imran-khan-vote;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# Keep the default server for IP access
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
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

# 2. Upload and apply the configuration
scp web3-domain-config.conf baremetal:/tmp/
ssh baremetal "sudo mv /tmp/web3-domain-config.conf /etc/nginx/sites-available/imran-khan-vote.conf && sudo ln -sf /etc/nginx/sites-available/imran-khan-vote.conf /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl restart nginx"

# 3. Create an info page for users
cat > user-access-guide.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Access $WEB3_DOMAIN</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .method { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .method h2 { color: #0066cc; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>How to Access $WEB3_DOMAIN</h1>
    
    <div class="method">
        <h2>Method 1: Direct IP Address (Works in Any Browser)</h2>
        <p>You can always access our site using the direct IP address:</p>
        <p><a href="http://$SERVER_IP">http://$SERVER_IP</a></p>
    </div>
    
    <div class="method">
        <h2>Method 2: Web3 Domain with Gateway (Works in Any Browser)</h2>
        <p>Access through a gateway service:</p>
        <p><a href="https://$WEB3_DOMAIN.link">https://$WEB3_DOMAIN.link</a></p>
    </div>
    
    <div class="method">
        <h2>Method 3: Native Web3 Domain (Requires Extension or Compatible Browser)</h2>
        <p>To access <code>$WEB3_DOMAIN</code> directly:</p>
        <ol>
            <li>Use a compatible browser like Brave or Opera, OR</li>
            <li>Install the Unstoppable Domains extension for <a href="https://chrome.google.com/webstore/detail/unstoppable-domains/beelkklmblgdljamcmoffgfbdddfpnnl">Chrome</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/unstoppable-domains/">Firefox</a></li>
        </ol>
        <p>Then simply enter <code>$WEB3_DOMAIN</code> in your address bar.</p>
    </div>
</body>
</html>
EOL

# 4. Upload the user guide to the server
scp user-access-guide.html baremetal:/var/www/imran-khan-vote/how-to-access.html

echo "Setup complete! Your Web3 domain is configured to point to your baremetal server."
echo "Remember to set up the DNS records in your Web3 domain provider's dashboard:"
echo "- Add an A record pointing to $SERVER_IP"
echo ""
echo "User access guide has been created at: /var/www/imran-khan-vote/how-to-access.html"

#!/bin/bash

# Migration script to move pmimrankhan.xyz from baremetal to echoesofstreet server
# Original server: 65.109.156.106 (baremetal)
# Target server: 95.216.25.234 (echoesofstreet)

# Set variables
SOURCE_HOST="baremetal"
TARGET_HOST="echoesofstreet"
TARGET_USER="$(whoami)"
WEB_ROOT="/var/www/imran-khan-vote"
LOCAL_BACKUP_DIR="./backup-$(date +%Y%m%d)"

echo "=== Starting migration from $SOURCE_HOST to $TARGET_HOST ==="

# Step 1: Create a local backup of the website files from the source server
echo "Creating local backup of website files from $SOURCE_HOST..."
mkdir -p $LOCAL_BACKUP_DIR
ssh $SOURCE_HOST "tar -czf /tmp/imran-khan-vote-backup.tar.gz -C /var/www imran-khan-vote"
scp $SOURCE_HOST:/tmp/imran-khan-vote-backup.tar.gz $LOCAL_BACKUP_DIR/
ssh $SOURCE_HOST "rm /tmp/imran-khan-vote-backup.tar.gz"

# Step 2: Extract the backup locally
echo "Extracting backup locally..."
mkdir -p $LOCAL_BACKUP_DIR/extracted
tar -xzf $LOCAL_BACKUP_DIR/imran-khan-vote-backup.tar.gz -C $LOCAL_BACKUP_DIR/extracted

# Step 3: Prepare the target server
echo "Preparing target server ($TARGET_HOST)..."
ssh $TARGET_HOST "
  # Check if Nginx is installed, if not install it
  if ! command -v nginx &> /dev/null; then
    echo 'Nginx not found, installing...'
    if command -v apt-get &> /dev/null; then
      # Debian/Ubuntu
      sudo apt-get update
      sudo apt-get install -y nginx
    elif command -v yum &> /dev/null; then
      # CentOS/RHEL
      sudo yum install -y epel-release
      sudo yum install -y nginx
    else
      echo 'Could not determine package manager. Please install Nginx manually.'
      exit 1
    fi
  else
    echo 'Nginx is already installed.'
  fi

  # Create the web root directory
  sudo mkdir -p $WEB_ROOT
  sudo chown $TARGET_USER:$TARGET_USER $WEB_ROOT
"

# Step 4: Copy website files to the target server
echo "Copying website files to $TARGET_HOST..."
scp -r $LOCAL_BACKUP_DIR/extracted/* $TARGET_HOST:$WEB_ROOT/

# Step 5: Copy Nginx configuration files
echo "Setting up Nginx configuration on $TARGET_HOST..."
scp pmimrankhan-xyz.conf $TARGET_HOST:/tmp/
scp pmimrankhan-unstoppable.conf $TARGET_HOST:/tmp/
scp combined-domains.conf $TARGET_HOST:/tmp/

# Step 6: Set up Nginx on the target server
ssh $TARGET_HOST "
  # Set up Nginx configuration
  if [ -d /etc/nginx/sites-available ]; then
    # Debian/Ubuntu style configuration
    sudo cp /tmp/pmimrankhan-xyz.conf /etc/nginx/sites-available/
    sudo cp /tmp/pmimrankhan-unstoppable.conf /etc/nginx/sites-available/
    
    # Create symbolic links if they don't exist
    sudo ln -sf /etc/nginx/sites-available/pmimrankhan-xyz.conf /etc/nginx/sites-enabled/
    sudo ln -sf /etc/nginx/sites-available/pmimrankhan-unstoppable.conf /etc/nginx/sites-enabled/
  else
    # CentOS/RHEL/Other style configuration
    sudo mkdir -p /etc/nginx/conf.d
    sudo cp /tmp/combined-domains.conf /etc/nginx/conf.d/
  fi
  
  # Clean up temporary files
  rm /tmp/pmimrankhan-xyz.conf /tmp/pmimrankhan-unstoppable.conf /tmp/combined-domains.conf
  
  # Test and reload Nginx
  sudo nginx -t && { sudo systemctl reload nginx || sudo service nginx reload || sudo nginx -s reload; }
"

# Step 7: Set up SSL certificates (if they exist on the source server)
echo "Checking for SSL certificates on $SOURCE_HOST..."
ssh $SOURCE_HOST "
  if [ -d /etc/letsencrypt/live/pmimrankhan.xyz ]; then
    echo 'SSL certificates found. Creating backup...'
    sudo tar -czf /tmp/letsencrypt-backup.tar.gz -C /etc letsencrypt
    sudo chown \$(whoami):\$(whoami) /tmp/letsencrypt-backup.tar.gz
  else
    echo 'No SSL certificates found for pmimrankhan.xyz'
    exit 0
  fi
"

# If SSL certificates exist, copy them to the target server
ssh $SOURCE_HOST "[ -f /tmp/letsencrypt-backup.tar.gz ]" && {
  echo "Copying SSL certificates to $TARGET_HOST..."
  scp $SOURCE_HOST:/tmp/letsencrypt-backup.tar.gz $LOCAL_BACKUP_DIR/
  ssh $SOURCE_HOST "rm /tmp/letsencrypt-backup.tar.gz"
  
  scp $LOCAL_BACKUP_DIR/letsencrypt-backup.tar.gz $TARGET_HOST:/tmp/
  
  ssh $TARGET_HOST "
    sudo mkdir -p /etc/letsencrypt
    sudo tar -xzf /tmp/letsencrypt-backup.tar.gz -C /etc
    rm /tmp/letsencrypt-backup.tar.gz
    
    # Uncomment SSL configuration in Nginx
    if [ -f /etc/nginx/sites-available/pmimrankhan-xyz.conf ]; then
      sudo sed -i 's/# server {/server {/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     listen/    listen/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     server_name/    server_name/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     ssl_/    ssl_/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     root/    root/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     index/    index/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     location/    location/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     try_files/    try_files/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     gzip/    gzip/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
      sudo sed -i 's/#     add_header/    add_header/g' /etc/nginx/sites-available/pmimrankhan-xyz.conf
    fi
    
    # Test and reload Nginx
    sudo nginx -t && { sudo systemctl reload nginx || sudo service nginx reload || sudo nginx -s reload; }
  "
  
  echo "SSL certificates transferred and configured."
} || echo "No SSL certificates to transfer."

echo "=== Migration completed successfully! ==="
echo "Next steps:"
echo "1. Update your DNS records to point pmimrankhan.xyz to $TARGET_HOST (95.216.25.234)"
echo "2. If you didn't have SSL certificates, run the following on $TARGET_HOST:"
echo "   sudo certbot --nginx -d pmimrankhan.xyz -d www.pmimrankhan.xyz"
echo "3. Test your website at http://$TARGET_HOST and https://pmimrankhan.xyz (after DNS update)"
echo ""
echo "Note: The blockchain contract remains unchanged as it's deployed on the blockchain, not on the server."

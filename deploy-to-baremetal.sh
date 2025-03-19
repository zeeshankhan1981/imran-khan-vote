#!/bin/bash

# Set variables
REMOTE_USER="$(whoami)"
REMOTE_HOST="baremetal"
REMOTE_DIR="/var/www/imran-khan-vote"
LOCAL_DIR="./deploy"

echo "Deploying to baremetal server..."

# Check if Nginx is installed, if not install it
echo "Checking if Nginx is installed..."
ssh $REMOTE_HOST "
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
"

# Create the directory on the remote server if it doesn't exist
ssh $REMOTE_HOST "sudo mkdir -p $REMOTE_DIR && sudo chown $REMOTE_USER:$REMOTE_USER $REMOTE_DIR"

# Copy the files to the remote server
echo "Copying files to $REMOTE_HOST:$REMOTE_DIR..."
scp -r $LOCAL_DIR/* $REMOTE_HOST:$REMOTE_DIR/

# Set up Nginx configuration
echo "Setting up Nginx configuration..."
ssh $REMOTE_HOST "
  # Check if sites-available directory exists
  if [ -d /etc/nginx/sites-available ]; then
    # Debian/Ubuntu style configuration
    sudo cp $REMOTE_DIR/imran-khan-vote.conf /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-available/imran-khan-vote.conf /etc/nginx/sites-enabled/
  else
    # CentOS/RHEL/Other style configuration
    sudo mkdir -p /etc/nginx/conf.d
    sudo cp $REMOTE_DIR/imran-khan-vote.conf /etc/nginx/conf.d/
  fi
  
  # Test and reload Nginx
  sudo nginx -t && { sudo systemctl reload nginx || sudo service nginx reload || sudo nginx -s reload; }
"

echo "Deployment completed successfully!"
echo "Your application is now available at http://vote.imrankhan.pk"

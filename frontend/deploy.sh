#!/bin/bash

# Build the frontend
echo "Building the frontend application with wallet-required voting..."
npm run build

# Create a directory for the deployment
mkdir -p ../deploy

# Copy the build files to the deployment directory
cp -r dist/* ../deploy/

# Create a version file with timestamp
echo "Creating version information file..."
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "Version: Wallet-Required Voting" > ../deploy/version.txt
echo "Deployed: $TIMESTAMP" >> ../deploy/version.txt
echo "This version requires wallet connection for all voting functionality." >> ../deploy/version.txt

echo "Frontend built and ready for deployment in the deploy directory"
echo "This version requires wallet connection for voting to ensure vote integrity."

#!/bin/bash

# Build the frontend
npm run build

# Create a directory for the deployment
mkdir -p ../deploy

# Copy the build files to the deployment directory
cp -r dist/* ../deploy/

echo "Frontend built and ready for deployment in the deploy directory"

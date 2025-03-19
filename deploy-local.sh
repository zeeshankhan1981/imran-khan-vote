#!/bin/bash

# Set up colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting local Hardhat network...${NC}"
echo -e "${YELLOW}This will run in the background. Press Ctrl+C to stop it when you're done.${NC}"

# Start a local Hardhat network in a new terminal window
osascript -e 'tell app "Terminal" to do script "cd '$PWD' && npx hardhat node"'

# Wait for the network to start
echo -e "${YELLOW}Waiting for local network to start...${NC}"
sleep 5

echo -e "${YELLOW}Compiling contract...${NC}"
npx hardhat compile

# Deploy to local network
echo -e "${YELLOW}Deploying to local Hardhat network...${NC}"
npx hardhat run scripts/deploy.js --network localhost

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Please update the CONTRACT_ADDRESS in frontend/src/App.jsx with the deployed contract address${NC}"
echo -e "${YELLOW}Then run ./deploy-to-server.sh to prepare the frontend for deployment${NC}"
echo -e "${YELLOW}Note: This is a local deployment for testing. For production, deploy to Polygon mainnet.${NC}"

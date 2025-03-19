#!/bin/bash

# Ensure .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create it with your API keys and private key."
    exit 1
fi

# Set up colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Compiling contract...${NC}"
npx hardhat compile

# Deploy to Sepolia testnet
echo -e "${YELLOW}Deploying to Sepolia testnet...${NC}"
npx hardhat run scripts/deploy.js --network sepolia

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Please update the CONTRACT_ADDRESS in frontend/src/App.jsx with the deployed contract address${NC}"
echo -e "${YELLOW}Then run ./deploy-to-server.sh to prepare the frontend for deployment${NC}"

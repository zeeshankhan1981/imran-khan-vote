#!/bin/bash

# Set up colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Getting wallet address from .env file...${NC}"

# Extract wallet address from private key
PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${YELLOW}Error: PRIVATE_KEY not found in .env file.${NC}"
    exit 1
fi

# Use Node.js to derive the wallet address from the private key
WALLET_ADDRESS=$(node -e "
const { ethers } = require('ethers');
const privateKey = '0x$PRIVATE_KEY';
const wallet = new ethers.Wallet(privateKey);
console.log(wallet.address);
")

echo -e "${GREEN}Your wallet address is: ${WALLET_ADDRESS}${NC}"
echo -e "${YELLOW}Please visit the following faucets to get test ETH tokens for Sepolia:${NC}"
echo -e "${GREEN}1. Alchemy Faucet: https://sepoliafaucet.com/${NC}"
echo -e "   - Connect your wallet"
echo -e "   - Verify with Captcha"
echo -e "   - Receive test ETH"
echo -e "${GREEN}2. QuickNode Faucet: https://faucet.quicknode.com/ethereum/sepolia${NC}"
echo -e "   - Paste your wallet address: ${WALLET_ADDRESS}"
echo -e "   - Complete verification"
echo -e "${GREEN}3. Infura Faucet: https://www.infura.io/faucet/sepolia${NC}"
echo -e "   - Paste your wallet address: ${WALLET_ADDRESS}"
echo -e "${YELLOW}After receiving test tokens, run ./deploy-contract.sh to deploy your contract.${NC}"

# Setting Up MetaMask for Polygon Mumbai Testnet

This guide will help you set up MetaMask for the Polygon Mumbai testnet and get test MATIC tokens.

## 1. Add Polygon Mumbai Network to MetaMask

1. Open MetaMask and click on the network dropdown at the top (where it says "Ethereum Mainnet" by default)
2. Click "Add Network"
3. Click "Add a network manually" at the bottom
4. Fill in the following details:
   - **Network Name**: Mumbai Testnet
   - **New RPC URL**: https://rpc-mumbai.maticvigil.com/
   - **Chain ID**: 80001
   - **Currency Symbol**: MATIC
   - **Block Explorer URL**: https://mumbai.polygonscan.com/

5. Click "Save"

## 2. Get Test MATIC Tokens

You'll need some test MATIC tokens to deploy contracts and interact with the Mumbai testnet:

1. Go to the [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Mumbai" network
3. Paste your MetaMask wallet address
4. Click "Submit" to receive test MATIC tokens

Alternatively, you can use:
- [Alchemy Mumbai Faucet](https://mumbaifaucet.com/)
- [QuickNode Faucet](https://faucet.quicknode.com/polygon/mumbai)

## 3. Create a New Test Account in MetaMask (Optional)

If you want to create a dedicated test account for development:

1. Open MetaMask
2. Click on your account icon in the top-right corner
3. Click "Create Account"
4. Name it "Development Account" or similar
5. Click "Create"
6. Send some test MATIC to this new account

## 4. Deploying Your Contract

When you're ready to deploy your contract:

1. Make sure your MetaMask is connected to the Mumbai Testnet
2. Ensure you have test MATIC in your account
3. Run the deployment script:
   ```
   npx hardhat run scripts/deploy.js --network polygon_mumbai
   ```

4. Copy the deployed contract address and update it in your frontend code

## 5. Testing Your dApp

1. Start your frontend development server:
   ```
   cd frontend && npm run dev
   ```

2. Connect MetaMask to your dApp
3. Test the voting functionality
4. Verify that votes are being recorded on the blockchain

## 6. Deploying to Polygon Mainnet

When you're ready to go live:

1. Switch MetaMask to the Polygon Mainnet
2. Ensure you have real MATIC in your account
3. Update the deployment script to use the polygon network
4. Deploy and update your frontend with the new contract address

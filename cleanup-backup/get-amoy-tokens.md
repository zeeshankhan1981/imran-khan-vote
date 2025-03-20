# Getting Test Tokens for Polygon Amoy Testnet

Since Polygon Mumbai has been deprecated, we'll be using Polygon Amoy testnet instead. Here's how to get test tokens for the Amoy testnet:

## 1. Add Polygon Amoy Network to MetaMask

1. Open MetaMask and click on the network dropdown at the top
2. Click "Add Network"
3. Click "Add a network manually" at the bottom
4. Fill in the following details:
   - **Network Name**: Polygon Amoy Testnet
   - **New RPC URL**: https://rpc-amoy.polygon.technology/
   - **Chain ID**: 80002
   - **Currency Symbol**: MATIC
   - **Block Explorer URL**: https://www.oklink.com/amoy

5. Click "Save"

## 2. Get Test MATIC Tokens

You can get test MATIC tokens for the Amoy testnet from the official Polygon faucet:

1. Go to the [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy" network
3. Paste your MetaMask wallet address
4. Click "Submit" to receive test MATIC tokens

## 3. Deploying to Polygon Amoy

To deploy your contract to the Polygon Amoy testnet, run:

```bash
npx hardhat run scripts/deploy.js --network polygon_amoy
```

## 4. Verifying Your Contract on Amoy

The Amoy testnet uses OKLink as its block explorer. To verify your contract:

1. Go to [OKLink Amoy Explorer](https://www.oklink.com/amoy)
2. Search for your contract address
3. Go to the "Contract" tab
4. Click "Verify and Publish"
5. Follow the instructions to verify your contract

## 5. Testing Your dApp

After deploying to Amoy:

1. Update your frontend with the new contract address
2. Make sure MetaMask is connected to the Polygon Amoy network
3. Test the voting functionality
4. Verify that votes are being recorded on the blockchain

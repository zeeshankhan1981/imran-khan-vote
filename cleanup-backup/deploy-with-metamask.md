# Deploying with MetaMask (No Private Key Required)

This guide explains how to deploy your contract using MetaMask directly, without needing to expose your private key in any files.

## Prerequisites

1. Install [MetaMask](https://metamask.io/) browser extension
2. Set up Polygon Mumbai testnet in MetaMask (see setup-metamask-guide.md)
3. Get test MATIC from a faucet

## Deployment Steps

### 1. Use Remix IDE for Contract Deployment

The easiest way to deploy without exposing your private key is to use Remix IDE:

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `ImranKhanVote.sol`
3. Copy and paste your contract code from `contracts/ImranKhanVote.sol`
4. Compile the contract (Solidity compiler tab)
5. Go to the "Deploy & Run Transactions" tab
6. Select "Injected Provider - MetaMask" as the environment
7. Make sure MetaMask is connected to Mumbai Testnet
8. Deploy the contract
9. Save the deployed contract address

### 2. Update Your Frontend

1. Open `frontend/src/App.jsx`
2. Update the `CONTRACT_ADDRESS` variable with your deployed contract address
3. Save the file

### 3. Build and Deploy the Frontend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Use the deployment script to prepare files for your server:
   ```bash
   ./deploy-to-server.sh
   ```

3. Transfer the files to your Hetzner server:
   ```bash
   scp -r deploy/* zeeshankhan@65.109.156.106:/home/zeeshankhan/imran-khan-vote/
   ```

4. SSH into your server and set up the web server:
   ```bash
   ssh zeeshankhan@65.109.156.106
   ./server-setup.sh
   ```

## Verifying Your Contract (Optional)

1. Go to [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
2. Search for your contract address
3. Go to the "Contract" tab
4. Click "Verify and Publish"
5. Follow the instructions to verify your contract

## Testing Your Deployment

1. Visit your website (http://65.109.156.106 or your domain)
2. Connect MetaMask to your dApp
3. Test the voting functionality
4. Verify that votes are being recorded on the blockchain

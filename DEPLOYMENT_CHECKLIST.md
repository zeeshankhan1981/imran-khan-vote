# Deployment Checklist

Use this checklist to ensure you've completed all necessary steps for deploying the Imran Khan Voting dApp.

## Local Development

- [ ] Install dependencies (`npm install` in both root and frontend directories)
- [ ] Compile smart contract (`npx hardhat compile`)
- [ ] Run tests (`npx hardhat test`)
- [ ] Start local development server (`cd frontend && npm run dev`)
- [ ] Test application locally

## Smart Contract Deployment

- [ ] Create `.env` file with API keys and private key
- [ ] Get test MATIC from faucet for Mumbai testnet (`node get-test-matic.js`)
- [ ] Deploy contract to Mumbai testnet (`./deploy-contract.sh`)
- [ ] Update `CONTRACT_ADDRESS` in `frontend/src/App.jsx`
- [ ] Test contract on Mumbai testnet
- [ ] When ready, deploy to Polygon mainnet

## Frontend Preparation

- [ ] Build frontend (`cd frontend && npm run build`)
- [ ] Prepare deployment package (`./deploy-to-server.sh`)
- [ ] Verify all files in the `deploy` directory

## Server Setup

- [ ] SSH into your Hetzner server (`ssh zeeshankhan@65.109.156.106`)
- [ ] Transfer deployment files to server
- [ ] Run server setup script (`./server-setup.sh`)
- [ ] Configure nginx
- [ ] Set up SSL certificate (if using a domain)
- [ ] Test website accessibility

## Final Verification

- [ ] Visit the deployed website
- [ ] Connect MetaMask to Polygon network
- [ ] Test voting functionality
- [ ] Check mobile responsiveness
- [ ] Monitor server and application logs

## Maintenance Plan

- [ ] Set up regular backups
- [ ] Configure automatic security updates
- [ ] Monitor contract activity on Polygonscan
- [ ] Plan for potential upgrades or improvements

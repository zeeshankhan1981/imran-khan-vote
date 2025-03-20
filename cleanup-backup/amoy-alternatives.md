# Alternative Approaches for Polygon Amoy

Since Polygon Amoy is a newer testnet, here are alternative approaches:

## Option 1: Use Sepolia Testnet Instead

Sepolia is widely supported and has many faucets available:

1. Update hardhat.config.js to deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Option 2: Direct Amoy Faucets

Try these direct links for Amoy test tokens:

1. [Polygon Amoy Faucet](https://amoy.polygonscan.com/faucet)
2. [QuickNode Amoy Faucet](https://faucet.quicknode.com/polygon/amoy)

## Option 3: Deploy to Polygon Mainnet with Minimal Funds

If you have a small amount of MATIC (less than $1 worth):

1. Update hardhat.config.js to use Polygon mainnet:
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

## Option 4: Use Local Hardhat Network for Testing

For testing purposes only:
```bash
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

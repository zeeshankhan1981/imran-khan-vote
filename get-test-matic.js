const { ethers } = require("hardhat");

async function main() {
  // Get the first signer (account) from Hardhat
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  
  console.log("Your account address:", address);
  console.log("\nTo get test MATIC for Mumbai testnet, visit one of these faucets:");
  console.log("1. https://faucet.polygon.technology/");
  console.log("2. https://mumbaifaucet.com/");
  console.log("\nTo get test MATIC for Polygon mainnet, you can:");
  console.log("1. Bridge from Ethereum: https://wallet.polygon.technology/bridge");
  console.log("2. Buy MATIC on an exchange and transfer to your wallet");
  
  console.log("\nYour current balance:");
  const balance = await ethers.provider.getBalance(address);
  console.log(`${ethers.formatEther(balance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Deploy the contract to Ethereum Mainnet
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ImranKhanVote contract to Ethereum Mainnet...");
  console.log("WARNING: This will deploy to MAINNET and cost real ETH!");
  console.log("Press Ctrl+C within 5 seconds to abort...");
  
  // Wait 5 seconds to give time to abort if needed
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Check the deployer's balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Get the contract factory
  const ImranKhanVote = await ethers.getContractFactory("ImranKhanVote");
  
  // Deploy the contract with ultra-low gas price for mainnet
  console.log("Deploying contract with ultra-low gas price...");
  const deployOptions = {
    gasPrice: ethers.parseUnits("0.5", "gwei"), // 0.5 gwei - ultra-low gas price
    gasLimit: 2000000 // Reduced gas limit
  };
  
  // Calculate and display estimated deployment cost
  const ethPrice = 3500; // Approximate ETH price in USD
  const gasCostWei = ethers.getBigInt(deployOptions.gasLimit) * ethers.getBigInt(deployOptions.gasPrice);
  const gasCostEth = ethers.formatEther(gasCostWei.toString());
  const gasCostUsd = parseFloat(gasCostEth) * ethPrice;
  
  console.log(`Estimated deployment cost: ${gasCostEth} ETH ($${gasCostUsd.toFixed(2)} USD)`);
  console.log("This is based on a gas price of 0.5 gwei and an ETH price of $3,500");
  
  if (gasCostUsd > 5) {
    console.log("\nWARNING: Estimated cost exceeds $5 USD");
    console.log("Consider lowering the gas price or gas limit to reduce costs");
    
    // Ask for confirmation to proceed
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question("\nDo you want to proceed with deployment? (yes/no): ", resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== "yes") {
      console.log("Deployment cancelled by user");
      process.exit(0);
    }
  }
  
  const imranKhanVote = await ImranKhanVote.deploy(deployOptions);
  
  console.log("Waiting for deployment transaction to be mined...");
  console.log("This may take a while on mainnet...");
  
  await imranKhanVote.waitForDeployment();
  
  const deployedAddress = await imranKhanVote.getAddress();
  console.log("Contract deployed to:", deployedAddress);
  
  // Update deploy-config.json
  const deployConfigPath = path.join(__dirname, "../deploy/deploy-config.json");
  const deployConfig = JSON.parse(fs.readFileSync(deployConfigPath, "utf8"));
  
  // Save the old config
  fs.writeFileSync(
    path.join(__dirname, "../deploy/deploy-config.backup.json"),
    JSON.stringify(deployConfig, null, 2)
  );
  
  // Update with new contract address
  const newConfig = {
    contractAddress: deployedAddress,
    network: "ethereum-mainnet",
    chainId: 1,
    deployedAt: new Date().toString(),
    notes: "Contract is deployed on Ethereum Mainnet (Chain ID 1). Users must connect to Ethereum Mainnet to interact with the contract."
  };
  
  fs.writeFileSync(
    deployConfigPath,
    JSON.stringify(newConfig, null, 2)
  );
  
  console.log("\n-----------------------------------");
  console.log("Contract successfully deployed to Ethereum Mainnet!");
  console.log(`Contract address: ${deployedAddress}`);
  console.log("\nNext steps:");
  console.log(`1. Update the CONTRACT_ADDRESS in frontend/src/App.jsx with: ${deployedAddress}`);
  console.log("2. Verify the contract on Etherscan");
  console.log("3. Build the frontend: cd frontend && npm run build");
  console.log("-----------------------------------\n");
  
  return deployedAddress;
}

main()
  .then((address) => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

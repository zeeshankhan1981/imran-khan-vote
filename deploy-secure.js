const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("Starting secure deployment process...");
  
  // Check if we have the necessary environment variables
  if (!process.env.INFURA_API_KEY) {
    console.error("Error: INFURA_API_KEY not found in .env file");
    process.exit(1);
  }
  
  console.log("Deploying contract to network:", network.name);
  
  // Get the contract factory
  const ImranKhanVote = await ethers.getContractFactory("ImranKhanVote");
  
  console.log("Deploying ImranKhanVote...");
  const imranKhanVote = await ImranKhanVote.deploy();
  
  await imranKhanVote.waitForDeployment();
  
  const address = await imranKhanVote.getAddress();
  console.log("ImranKhanVote deployed to:", address);
  
  console.log("\nNext steps:");
  console.log(`1. Update the CONTRACT_ADDRESS in frontend/src/App.jsx with: ${address}`);
  console.log("2. Build the frontend: cd frontend && npm run build");
  console.log("3. Deploy to your server using the deploy-to-server.sh script");
  
  return address;
}

// Execute the deployment
main()
  .then((address) => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

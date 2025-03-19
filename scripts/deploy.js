const hre = require("hardhat");

async function main() {
  console.log("Network:", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  console.log("Deploying ImranKhanVote contract...");
  const ImranKhanVote = await hre.ethers.getContractFactory("ImranKhanVote");
  
  // Set deployment options with lower gas limit
  const deployOptions = {
    gasLimit: 1000000 // Lower gas limit
  };
  
  const imranKhanVote = await ImranKhanVote.deploy(deployOptions);

  console.log("Waiting for deployment transaction to be mined...");
  await imranKhanVote.waitForDeployment();
  
  const address = await imranKhanVote.getAddress();
  console.log("ImranKhanVote deployed to:", address);
  
  console.log("\n-----------------------------------");
  console.log("Next steps:");
  console.log(`1. Update the CONTRACT_ADDRESS in frontend/src/App.jsx with: ${address}`);
  console.log("2. Build the frontend: cd frontend && npm run build");
  console.log("3. Deploy to your server using the deploy-to-server.sh script");
  console.log("-----------------------------------\n");
  
  return address;
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

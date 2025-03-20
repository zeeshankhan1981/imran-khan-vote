// Script to verify the contract on Ethereum Mainnet
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Verifying ImranKhanVote contract on Ethereum Mainnet...");
  
  // Get contract address from deploy-config.json
  const deployConfigPath = path.join(__dirname, "../deploy/deploy-config.json");
  const deployConfig = JSON.parse(fs.readFileSync(deployConfigPath, "utf8"));
  const contractAddress = deployConfig.contractAddress;
  
  console.log(`Contract address: ${contractAddress}`);
  
  try {
    // Verify the contract on Etherscan
    console.log("Submitting verification request to Etherscan...");
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      contract: "contracts/ImranKhanVote.sol:ImranKhanVote"
    });
    
    console.log("Contract verification successful!");
  } catch (error) {
    if (error.message.includes("Already Verified") || error.message.includes("already verified")) {
      console.log("Contract is already verified on Etherscan.");
    } else {
      console.error("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

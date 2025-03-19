const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = signer.address;
  
  console.log("Checking balance for address:", address);
  
  const balance = await hre.ethers.provider.getBalance(address);
  const balanceInEth = hre.ethers.formatEther(balance);
  
  console.log("Balance:", balanceInEth, "ETH");
  
  if (balance.toString() === "0") {
    console.log("You have no ETH in your wallet. Please get some from a faucet.");
    console.log("Faucet URL: https://sepoliafaucet.com/");
  } else {
    console.log("You have enough ETH to deploy your contract!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const NETWORK = process.env.NETWORK || "hardhat";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/demo`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 35000000000,
    },
    polygon_mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 35000000000,
    },
    polygon_amoy: {
      url: `https://rpc-amoy.polygon.technology/`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 35000000000,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 100000000000,
    },
    mainnet: {
      url: `https://ethereum.publicnode.com`,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

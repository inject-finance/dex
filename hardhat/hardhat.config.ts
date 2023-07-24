import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const { 
  GOERLI_TESTNET_PRIVATE_KEY,
  ARBITRUM_MAINNET_RPC_URL,
  ALCHEMY_ARBITRUM_GOERLI,
  ARBITRUM_MAINNET_ACCOUNT,
  ARBISCAN_APIKEY
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
      compilers: [
      {
        version: "0.8.18",
      }
    ],
    overrides: {
      "contracts/WETH.sol": {
        version: "0.4.18",
        settings: { }
      }
    }
  },
  networks:{
    arbitrumGoerli: {
      url: ALCHEMY_ARBITRUM_GOERLI,
      chainId: 421613,
      accounts: [GOERLI_TESTNET_PRIVATE_KEY || '']
    },
    arbitrumOne: {
      url: ARBITRUM_MAINNET_RPC_URL,
      chainId: 42161,
      accounts: [ARBITRUM_MAINNET_ACCOUNT || '']
    }
  },
  etherscan: {
    apiKey: ARBISCAN_APIKEY
  }

};

export default config;


import { ethers, network } from "hardhat";

async function main() {
  
  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.deployed();

  const DAI = await ethers.getContractFactory("DAI");
  const dai = await DAI.deploy();
  await dai.deployed();
  const fees = 3;
  const AMM = await ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(weth.address, dai.address, fees);
  await amm.deployed();

  await weth.approve(amm.address, ethers.utils.parseEther("100"));
  await dai.approve(amm.address, ethers.utils.parseEther("188567"));

  await amm.addLiquidity(
    ethers.utils.parseEther("100"), 
    ethers.utils.parseEther("188567")
  );
  
  const reserve0 = await amm.reserve0();
  const reserve1 = await amm.reserve1();

  console.log(`Contract AMM deployed to ${amm.address} on ${network.name}`);
  console.log(
    `WETH contract address: ${weth.address} \n` +     
    `DAI contract address: ${dai.address} \n` +
    `WETH reserve: ${ethers.utils.formatEther(reserve0)} \n` + 
    `DAI reserve: ${ethers.utils.formatEther(reserve1)}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
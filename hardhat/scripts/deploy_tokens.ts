import { ethers, run, network } from 'hardhat'
import { utils } from 'ethers';

async function main() {
  const fees = 3;
  const amount = "10000000";
  
  const receiver = "0x49baEaA5b4006B63b51632F6cF6314910683ABaD";
  try{
    /*const USDC = await ethers.getContractFactory('USDC');
    const usdc = await USDC.deploy();
    await usdc.deployed();*/

    /*const Token1 = await ethers.getContractFactory('Token');
    const link = await Token1.deploy("Chainlink Token", "LINK");
    await link.deployed(); */

    const Token2 = await ethers.getContractFactory('Token');
    const bat = await Token2.deploy("xBAT Token", "xBAT");
    await bat.deployed();
    /*
    const Token3 = await ethers.getContractFactory('Token');
    const arb = await Token3.deploy("Arbitrum Token", "ARB");
    await arb.deployed(); */

    const Token4 = await ethers.getContractFactory('Token');
    const dai = await Token4.deploy("xDAI Token", "xDAI");
    await dai.deployed();

    /*
    const Token5 = await ethers.getContractFactory('Token');
    const inj3 = await Token5.deploy("Inject Finance", "INJ3");
    await inj3.deployed();
    */
    
    //await link.transfer(receiver, utils.parseEther(amount));
    await bat.transfer(receiver, utils.parseEther(amount));
    //await arb.transfer(receiver, utils.parseEther(amount));
    await dai.transfer(receiver, utils.parseEther(amount));
    //await inj3.transfer(receiver, utils.parseEther(amount));
    /*await bat.transfer(receiver, 1000000000000);
    await usdc.transfer(receiver, 1000000000000);*/
    
    /*console.log(
        `LINK contract address: ${link.address} \n` +
        `BAT contract address: ${bat.address} \n` +
        `ARB contract address: ${arb.address} \n` +
        `USDC contract address: ${usdc.address} \n` +
        `INJ3 contract address: ${inj3.address} \n`
    )*/
    //console.log(usdc.address);

    console.log(
        `xBAT contract address: ${bat.address} \n` +
        `xDAI contract address: ${dai.address} \n`
    )
  }
  catch (error) {
    console.log("Deployment error: ", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})


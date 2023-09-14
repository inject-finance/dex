import { ethers, network } from 'hardhat'
import { utils } from 'ethers'

async function main() {
  const fees = 30
  const injTotalSupply = utils.parseEther('10000000')
  
  // WETH Arbitrum One
  const wethContractAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  
  try {
    const PoolFactory = await ethers.getContractFactory('PoolFactory')
    const poolFactory = await PoolFactory.deploy()
    await poolFactory.deployed()

    const DexRouter = await ethers.getContractFactory('DexRouter')
    const dexRouter = await DexRouter.deploy(
      poolFactory.address,
      wethContractAddress
    )
    await dexRouter.deployed()

    const InjectToken = await ethers.getContractFactory('InjectToken')
    const injectToken = await InjectToken.deploy(injTotalSupply)
    await injectToken.deployed()

    const StakePoolToken = await ethers.getContractFactory('StakePoolToken')
    const stakePoolToken = await StakePoolToken.deploy(injectToken.address)
    await stakePoolToken.deployed()

    const account1 = ''
    const account2 = ''
    await poolFactory.addToWhitelist([account1, account2])

    saveFrontendFiles(PoolFactory, 'PoolFactory')
    saveFrontendFiles(DexRouter, 'DexRouter')
    saveFrontendFiles(InjectToken, 'InjectToken')
    saveFrontendFiles(StakePoolToken, 'StakePoolToken')
    

    console.log(
      `Contract Pool Factory deployed to ${poolFactory.address} on ${network.name}`
    )
    console.log(
      `Contract Dex Router deployed to ${dexRouter.address} on ${network.name}`
    )
    console.log(
      `InjectToken contract address: ${injectToken.address} \n` +
      `Staking contract address: ${stakePoolToken.address} \n` +
      `WETH contract address: ${wethContractAddress} \n`
    )
  } catch (error) {
    console.log('Deployment error: ', error)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

function saveFrontendFiles(contract: any, name: string) {
  const fs = require('fs')
  const hre = require('hardhat')

  const contractsDir = __dirname + '/../../client/src/contracts/data'

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  const contractArtifact = hre.artifacts.readArtifactSync(name)

  fs.writeFileSync(
    contractsDir + `/${name}.constants.ts`,
    `export const ${name}Constants = ${JSON.stringify(
      { address: contract.address, abi: contractArtifact.abi },
      undefined,
      2
    )}`
  )
}

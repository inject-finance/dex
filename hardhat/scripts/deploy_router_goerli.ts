import { ethers, run, network } from 'hardhat'
import { utils } from 'ethers'

async function main() {
  const fees = 30
  const injTotalSupply = utils.parseEther('10000000')
  const wethInitialLiquidity = '.1'
  const daiInitialLiquidity = '188.567'

  const wethContractAddress = '0x603c24B697D9302081F6472aA71849268c629620'
  const daiContractAddress = '0xfBdeA73Bfd3869edE9FEa4A1fa3B18f13a2d2008'
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

    const deployedInjectToken = '0x288E98CaeaD8Fbe29641Ebf3C8CA560726b2bf8D'
    const StakePoolToken = await ethers.getContractFactory('StakePoolToken')
    const stakePoolToken = await StakePoolToken.deploy(deployedInjectToken)
    await stakePoolToken.deployed()

    const weth = await ethers.getContractAt('WETH9', wethContractAddress)
    const dai = await ethers.getContractAt('DAI', daiContractAddress)

    await weth.deposit({ value: utils.parseEther(wethInitialLiquidity) })

    await weth.approve(
      dexRouter.address,
      utils.parseEther(wethInitialLiquidity)
    )

    await dai.approve(dexRouter.address, utils.parseEther(daiInitialLiquidity))

    const account1 = '0x1D5B8a1a9eC3a6608F280520a67e8cB7a14600ba'
    const account2 = '0x0d2Dc4E9ebc1465E86Fdf6ab18377CB82eCf7548'
    await poolFactory.addToWhitelist([account1, account2])

    await poolFactory.createPair(weth.address, dai.address, fees)

    await dexRouter.addTokenToTokenLiquidity(
      weth.address,
      dai.address,
      utils.parseEther(wethInitialLiquidity),
      utils.parseEther(daiInitialLiquidity),
      0,
      0
    )

    const [reserve0, reserve1] = await dexRouter.getTokenPairReserves(
      weth.address,
      dai.address
    )

    saveFrontendFiles(PoolFactory, 'PoolFactory')
    saveFrontendFiles(DexRouter, 'DexRouter')
    saveFrontendFiles(InjectToken, 'InjectToken')
    saveFrontendFiles(StakePoolToken, 'StakePoolToken')
    saveFrontendFiles(dai, 'DAI')
    saveFrontendFiles(weth, 'WETH9')

    console.log(
      `Contract Pool Factory deployed to ${poolFactory.address} on ${network.name}`
    )
    console.log(
      `Contract Dex Router deployed to ${dexRouter.address} on ${network.name}`
    )
    console.log(
      `InjectToken contract address: ${deployedInjectToken} \n` +
        `Staking contract address: ${stakePoolToken.address} \n` +
        `WETH contract address: ${weth.address} \n` +
        `DAI contract address: ${dai.address} \n` +
        `WETH reserve: ${utils.formatEther(reserve0)} \n` +
        `DAI reserve: ${utils.formatEther(reserve1)}`
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

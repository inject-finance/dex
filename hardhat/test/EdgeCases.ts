import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers } from "hardhat";
import bn  from 'bignumber.js';

const initialTokens = utils.parseEther("1000");
const initialDaiTokens = utils.parseEther("100000");
const initialReserve = utils.parseEther("10000");
const day = 24 * 60 * 60;
const month = 30 * day;
const fees = 30; //.3%
const _ownerFees = 10; //.1%
const ZERO = utils.parseEther("0");
const ONE = utils.parseEther("1");
const FIVE = utils.parseEther("5");
const FIFTY = "50";
const ONEWETH = utils.parseEther("1868");

const factor = 10000;
const injTotalSupply = utils.parseEther("10000000");
const ZeroAddress = ethers.constants.AddressZero;

describe("DEX Router Test", () => {
    async function deployPoolFactory() {
    const [owner, supplier1, supplier2, supplier3, trader1, trader2, account1] = await ethers.getSigners();
    
    const WETH = await ethers.getContractFactory("WETH9");
    const weth = await WETH.deploy();
    await weth.deployed();

    const DAI = await ethers.getContractFactory("DAI");
    const dai = await DAI.deploy();
    await dai.deployed();

    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    const poolFactory = await PoolFactory.deploy();
    await poolFactory.deployed();

    const DexRouter = await ethers.getContractFactory("DexRouter");
    const dexRouter = await DexRouter.deploy(poolFactory.address, weth.address);
    await dexRouter.deployed();

    const InjectToken = await ethers.getContractFactory("InjectToken");
    const injectToken = await InjectToken.deploy(injTotalSupply);
    await injectToken.deployed();

    const StakePool = await ethers.getContractFactory("StakePoolToken");
    const stakePool = await StakePool.deploy(injectToken.address);
    await stakePool.deployed();
    
    await weth.connect(supplier1).deposit({value: initialTokens});
    await weth.connect(supplier2).deposit({value: initialTokens});
    await weth.connect(supplier3).deposit({value: initialTokens});
    
    await dai.transfer(supplier1.address, initialDaiTokens);
    await dai.transfer(supplier2.address, initialDaiTokens);
    await dai.transfer(supplier3.address, initialDaiTokens);
    
    return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, owner, supplier1, supplier2,supplier3, account1 };
  }

  async function beforeAddingLiquidity() {
    const { poolFactory, dexRouter, weth, dai, injectToken, supplier1, stakePool, supplier2, supplier3} = await loadFixture(deployPoolFactory);

    const wethAmount = ONE.mul(1);
    const daiAmount = wethAmount.mul(1869);

    // Create a pool with the tokens WETH and DAI
    await expect(poolFactory.createPair(weth.address, dai.address, fees))
        .not.to.be.reverted;

    // Verify that the pair was created
    expect(await poolFactory.pairExists(weth.address, dai.address)).to.be.equal(true);
        
    // Obtain the pool address
    const poolAddress = await poolFactory.getPairAddress(weth.address, dai.address);
        
    await weth.connect(supplier1).approve(dexRouter.address, wethAmount.mul(2));
    await dai.connect(supplier1).approve(dexRouter.address, daiAmount.mul(2));

    await weth.connect(supplier2).approve(dexRouter.address, wethAmount.div(2));
    await dai.connect(supplier2).approve(dexRouter.address, daiAmount.div(2));

    await weth.connect(supplier3).approve(dexRouter.address, wethAmount);
    await dai.connect(supplier3).approve(dexRouter.address, daiAmount);

    const dexPool = await ethers.getContractAt("DexPool", poolAddress);

    return {wethAmount, daiAmount, poolAddress, dexPool, injectToken, stakePool, poolFactory, dexRouter, weth, dai, supplier1, supplier2, supplier3}
  }

  async function beforeStaking() {
        const { poolFactory, injectToken, dexRouter, stakePool, weth, dai, supplier1, supplier2, supplier3} = await loadFixture(deployPoolFactory);
        const { wethAmount, daiAmount, poolAddress, dexPool } = await loadFixture(beforeAddingLiquidity);

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.mul(2), daiAmount.mul(2), 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier2)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.div(2), daiAmount.div(2), 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier3)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        const balance1 = await dexPool.balanceOf(supplier1.address)
        const balance2 = await dexPool.balanceOf(supplier2.address)
        const balance3 = await dexPool.balanceOf(supplier3.address)

        await expect(dexPool.connect(supplier1).approve(stakePool.address, balance1))
          .not.to.be.reverted;

        await expect(dexPool.connect(supplier2).approve(stakePool.address, balance2))
          .not.to.be.reverted;

        await expect(dexPool.connect(supplier3).approve(stakePool.address, balance3))
          .not.to.be.reverted;

        return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, balance3, supplier2, supplier3, poolAddress, dexPool, wethAmount, daiAmount}
  }
  async function setStakingPool() {
        const { dexPool, poolFactory, poolAddress, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, balance3, supplier2, supplier3, wethAmount, daiAmount } = await loadFixture(beforeStaking);

        await expect(injectToken.approve(stakePool.address, initialReserve))
          .not.to.be.reverted;

        await expect(stakePool.setStakingPool(dexPool.address, 2000, initialReserve, FIVE, ONE))
          .not.to.be.reverted;

        return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, balance3, supplier2, supplier3, poolAddress, dexPool, wethAmount, daiAmount}
  }

  describe("Test staking feature", () => {
      it("Should allow a user to be able to stake", async () => {
        const { dexPool, supplier1, dexRouter, injectToken, weth, dai, wethAmount, stakePool, supplier2, daiAmount } = await loadFixture(beforeAddingLiquidity);
        
        await weth.connect(supplier1).approve(dexRouter.address, wethAmount);
        await dai.connect(supplier1).approve(dexRouter.address, daiAmount);

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        const balance1 = await dexPool.balanceOf(supplier1.address)

        await expect(dexPool.connect(supplier1).approve(stakePool.address, balance1))
          .not.to.be.reverted;

        await expect(injectToken.approve(stakePool.address, initialReserve))
          .not.to.be.reverted;

        await expect(stakePool.setStakingPool(dexPool.address, 200, initialReserve, FIVE, ONE))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(month);
        
        const rewards1 = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier1], [rewards1]);

      });

      it("Should be able to stake", async () => {
        const { dexPool, supplier1, dexRouter, injectToken, weth, dai, wethAmount, stakePool, supplier2, daiAmount } = await loadFixture(beforeAddingLiquidity);
        
        await weth.connect(supplier1).approve(dexRouter.address, wethAmount);
        await dai.connect(supplier1).approve(dexRouter.address, daiAmount);

        await weth.connect(supplier2).approve(dexRouter.address, wethAmount.mul(10));
        await dai.connect(supplier2).approve(dexRouter.address, daiAmount.mul(10));

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier2)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.mul(10), daiAmount.mul(10), 0, 0))
          .not.to.be.reverted;

        const balance1 = await dexPool.balanceOf(supplier1.address)
        const balance2 = await dexPool.balanceOf(supplier2.address)

        await expect(dexPool.connect(supplier1).approve(stakePool.address, balance1))
          .not.to.be.reverted;

        await expect(dexPool.connect(supplier2).approve(stakePool.address, balance2))
          .not.to.be.reverted;

        await expect(injectToken.approve(stakePool.address, initialReserve))
          .not.to.be.reverted;

        await expect(stakePool.setStakingPool(dexPool.address, 200, initialReserve, FIVE, ONE))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier2).stakeToken(balance2, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(month);
        const rewards1 = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier1], [rewards1]);

        await time.increase(month);
        const rewards2 = await stakePool.getTotalRewards(dexPool.address, supplier2.address);
        await expect(stakePool.connect(supplier2).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier2], [rewards2]);

      });

      it("Should allow several users to be able to stake", async () => {
        const { dexPool, supplier1, dexRouter, injectToken, weth, dai, wethAmount, stakePool, supplier2, supplier3, daiAmount } = await loadFixture(beforeAddingLiquidity);
        
        await weth.connect(supplier1).approve(dexRouter.address, wethAmount);
        await dai.connect(supplier1).approve(dexRouter.address, daiAmount);

        await weth.connect(supplier2).approve(dexRouter.address, wethAmount.mul(10));
        await dai.connect(supplier2).approve(dexRouter.address, daiAmount.mul(10));

        await weth.connect(supplier3).approve(dexRouter.address, wethAmount.mul(10));
        await dai.connect(supplier3).approve(dexRouter.address, daiAmount.mul(10));

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier2)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.mul(10), daiAmount.mul(10), 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier3)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.mul(10), daiAmount.mul(10), 0, 0))
          .not.to.be.reverted;

        const balance1 = await dexPool.balanceOf(supplier1.address)
        const balance2 = await dexPool.balanceOf(supplier2.address)
        const balance3 = await dexPool.balanceOf(supplier3.address)

        await expect(dexPool.connect(supplier1).approve(stakePool.address, balance1))
          .not.to.be.reverted;

        await expect(dexPool.connect(supplier2).approve(stakePool.address, balance2))
          .not.to.be.reverted;

        await expect(dexPool.connect(supplier3).approve(stakePool.address, balance3))
          .not.to.be.reverted;

        await expect(injectToken.approve(stakePool.address, initialReserve))
          .not.to.be.reverted;

        await expect(stakePool.setStakingPool(dexPool.address, 500, initialReserve, FIVE, ONE))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month * 3))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier2).stakeToken(balance2, dexPool.address, month * 3))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier3).stakeToken(balance3, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(month * 3);

        const rewards1 = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier1], [rewards1]);

        const rewards2 = await stakePool.getTotalRewards(dexPool.address, supplier2.address);
        await expect(stakePool.connect(supplier2).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier2], [rewards2]);

        const rewards3 = await stakePool.getTotalRewards(dexPool.address, supplier3.address);
        await expect(stakePool.connect(supplier3).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier3], [rewards3]);

      });

      it("Should validate staking for a month", async () => {
        const { dexPool, stakePool, dai, supplier1, balance1, injectToken, daiAmount } = await loadFixture(setStakingPool);

        await stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month);

        await time.increase(month);
        
        const rewards1 = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier1], [rewards1]);
        
      });

      it("Should validate staking for several stakers", async () => {
        const { dexPool, stakePool, dai, supplier1, supplier2, supplier3, balance1, balance2, balance3, injectToken, daiAmount } = await loadFixture(setStakingPool);
  
        await stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month);
        await stakePool.connect(supplier2).stakeToken(balance2, dexPool.address, month);
        await stakePool.connect(supplier3).stakeToken(balance3, dexPool.address, month);

        await time.increase(month);

        const rewards1 = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier1], [rewards1]);
        
        const rewards2 = await stakePool.getTotalRewards(dexPool.address, supplier2.address);
        await expect(stakePool.connect(supplier2).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier2], [rewards2]);

        const rewards3 = await stakePool.getTotalRewards(dexPool.address, supplier3.address);
        await expect(stakePool.connect(supplier3).claimRewards(dexPool.address))
          .to.changeTokenBalances(injectToken, [supplier3], [rewards3]);
      });
  });
});

import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers } from "hardhat";
import bn  from 'bignumber.js';
import { days } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration";

const initialTokens = utils.parseEther("1000");
const initialReserve = utils.parseEther("10000");
const day = 24 * 60 * 60;
const month = 30 * 24 * 60 * 60;
const fees = 30; //.3%
const _ownerFees = 10; //.1%
const ZERO = utils.parseEther("0");
const ONE = utils.parseEther("1");
const FIVE = utils.parseEther("5");
const FIFTY = "50";
const ONEHUNDRED = "100";
const ONEMILLION = "1000000";
const TEN = "10";
const factor = 10000;
const injTotalSupply = utils.parseEther("10000000");
const ZeroAddress = ethers.constants.AddressZero;

describe("DEX Router Test", () => {
  
  async function deployPoolFactory() {
    const [owner, supplier1, supplier2, trader1, trader2, account1] = await ethers.getSigners();
    
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
    await weth.connect(trader1).deposit({value: initialTokens});
    await weth.connect(trader2).deposit({value: initialTokens});

    await dai.transfer(supplier1.address, initialTokens);
    await dai.transfer(supplier2.address, initialTokens);
    await dai.transfer(trader1.address, initialTokens);
    await dai.transfer(trader2.address, initialTokens);

    return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, owner, supplier1, supplier2, trader1, trader2, account1 };
  }
  async function beforeAddingLiquidity() {
    const { poolFactory, dexRouter, weth, dai, supplier1, supplier2, trader1, trader2} = await loadFixture(deployPoolFactory);

    const wethAmount = utils.parseEther(FIFTY);
    const daiAmount = utils.parseEther(ONEHUNDRED);

    // Create a pool with the tokens WETH and DAI
    await expect(poolFactory.createPair(weth.address, dai.address, fees))
        .not.to.be.reverted;

    // Verify that the pair was created
    expect(await poolFactory.pairExists(weth.address, dai.address)).to.be.equal(true);
        
    // Obtain the pool address
    const poolAddress = await poolFactory.getPairAddress(weth.address, dai.address);
        
    await weth.connect(supplier1).approve(dexRouter.address, wethAmount);
    await dai.connect(supplier1).approve(dexRouter.address, daiAmount);

    await weth.connect(supplier2).approve(dexRouter.address, wethAmount.div(2));
    await dai.connect(supplier2).approve(dexRouter.address, daiAmount.div(2));

    await weth.connect(trader1).approve(dexRouter.address, wethAmount);
    await dai.connect(trader1).approve(dexRouter.address, daiAmount);

    const dexPool = await ethers.getContractAt("DexPool", poolAddress);

    return {wethAmount, daiAmount, poolAddress, dexPool, poolFactory, dexRouter, weth, dai, supplier1, trader1, supplier2, trader2}
  }

  async function beforeStaking() {
        const { poolFactory, injectToken, dexRouter, stakePool, weth, dai, supplier1, supplier2, trader1} = await loadFixture(deployPoolFactory);
        const { wethAmount, daiAmount, poolAddress, dexPool } = await loadFixture(beforeAddingLiquidity);

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        await expect (dexRouter.connect(supplier2)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.div(2), daiAmount.div(2), 0, 0))
          .not.to.be.reverted;

        const balance1 = await dexPool.balanceOf(supplier1.address)
        const balance2 = await dexPool.balanceOf(supplier2.address)
        
        await expect(dexPool.connect(supplier1).approve(stakePool.address, balance1))
          .not.to.be.reverted;

        return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, supplier2, trader1, poolAddress, dexPool, wethAmount, daiAmount}
  }
  async function setStakingPool() {
        const { dexPool, poolFactory, poolAddress, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, supplier2, trader1, wethAmount, daiAmount } = await loadFixture(beforeStaking);
        await expect(injectToken.approve(stakePool.address, initialReserve))
          .not.to.be.reverted;

        await expect(stakePool.setStakingPool(dexPool.address, 200, initialReserve, FIVE, ONE))
          .not.to.be.reverted;

        return { poolFactory, dexRouter, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, supplier2, trader1, poolAddress, dexPool, wethAmount, daiAmount}
  }

  describe("Test staking feature", () => {
      it("Should be able to stake", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

      });

      it("Should not be able to initialize a pool that exists", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.setStakingPool(dexPool.address, 20, initialReserve, FIVE, ONE))
          .to.be.revertedWith("pool exists!");
      });

      it("Should not be able to stake if pool is not initialized", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, supplier2, wethAmount, daiAmount } = await loadFixture(beforeStaking);

        const balance1 = await dexPool.balanceOf(supplier1.address)
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .to.be.revertedWith("pool is not active!");
      });

      it("Should emit an event", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .to.emit(stakePool, "LogStakeToken")
          .withArgs(supplier1.address, balance1, dexPool.address);
      });

      it("Should stake the minimum amount", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        const minAmmount = (await stakePool.poolInfo(dexPool.address)).minStakeAmount;
        await expect(stakePool.connect(supplier1).stakeToken(minAmmount.sub(1), dexPool.address, month))
          .to.be.revertedWith("stake amount not enough!");
      });

      //require(_duration > 0 && _duration <= maxDuration, "duration not allowed!");
      it("Should verify the duration", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        const maxDuration = await stakePool.maxDuration();
        const minAmmount = (await stakePool.poolInfo(dexPool.address)).minStakeAmount;

        await expect(stakePool.connect(supplier1).stakeToken(minAmmount, dexPool.address, maxDuration.add(month)))
          .to.be.revertedWith("duration not allowed!");

        await expect(stakePool.connect(supplier1).stakeToken(minAmmount, dexPool.address, 0))
          .to.be.revertedWith("duration not allowed!");
      });

      it("Should verify the pool reserve", async () => {
        const { dexPool, stakePool, weth, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        expect((await stakePool.poolInfo(dexPool.address)).poolReserves).to.be.equal(initialReserve);

      });
      

      it("Should not add more shares than balance", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1.add(1), dexPool.address, month))
          .to.be.revertedWith("insufficient shares!");
      });

      it("Should not stake if pool is not active", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await stakePool.turnOnOffPool(dexPool.address, false);
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .to.be.revertedWith("pool is not active!");
      });

      it("Should verify staking pool inject token balance", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        const injContractBalance = await injectToken.balanceOf(dexPool.address);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        const newInjContractBalance = await dexPool.balanceOf(stakePool.address);

        expect(newInjContractBalance).to.be.equal(injContractBalance.add(balance1));
      });

      it("Should validate stakePool info after staking", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        const _stakePool = await stakePool.stakeInfo(dexPool.address, supplier1.address);
        const _totalSupply= await dexPool.totalSupply();

        expect(_stakePool.start).to.be.equal(await time.latest())
        expect(_stakePool.end).to.be.equal((await time.latest()) + month);
        expect(_stakePool.stakeAmount).to.be.equal(balance1);
        expect(_stakePool.totalSupply).to.be.equal(_totalSupply);
        expect(_stakePool.totalClaimed).to.be.equal(ZERO);

        expect(await stakePool.addressStaked(supplier1.address)).to.be.equal(true);
        expect((await stakePool.poolInfo(dexPool.address)).totalStakers).to.be.equal(1);
      });

      it("Should not be able to stake more than once at the same time", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .to.be.revertedWith("address is staking!")

      });

      it("Should be able to stake only a portion of its shares", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(stakePool.connect(supplier1).stakeToken(balance1.div(2), dexPool.address, month))
          .not.to.be.reverted;
      });
  });
  describe("Test claim rewards feature", () => {
      it("should be able to claim rewards", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;
        
        await time.increase(month);

        /*await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .not.to.be.reverted; */
      });

      it("should receive rewards", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, 3 * month))
          .not.to.be.reverted;
        
        await time.increase(month * 3);

        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .not.to.be.reverted;
      });

      it("should emit an event", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;
        
        await time.increase(month);

        const totalRewards = await stakePool.getTotalRewards(dexPool.address, supplier1.address);

        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.emit(stakePool, "LogClaimRewards")
          .withArgs(supplier1.address, totalRewards, dexPool.address);
      });

      it("should claim max rewards amount after late claim", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(2 * month);

        const totalRewards = await stakePool.getTotalRewards(dexPool.address, supplier1.address);

        await stakePool.connect(supplier1).claimRewards(dexPool.address);

        const injBalance = await injectToken.balanceOf(supplier1.address);

        expect(injBalance).to.be.equal(totalRewards);
      });

      it("should claim less rewards amount after early claim", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(month / 2);

        await stakePool.connect(supplier1).claimRewards(dexPool.address);

        const totalRewards = await stakePool.getTotalRewards(dexPool.address, supplier1.address);
        
        const injBalance = await injectToken.balanceOf(supplier1.address);

        //expect(injBalance).to.be.equal(totalRewards);
      });

      it("should penalize for early claiming before the minimum staking time", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await expect(dexPool.connect(supplier2).approve(stakePool.address, balance2))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier2).stakeToken(balance2, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(1);

        await time.increase(6 * day);

        const totalRewards = await stakePool.getTotalRewards(dexPool.address, supplier2.address);

        await expect(stakePool.connect(supplier1).stakeToken(balance2, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(6 * day);

        const penalty = totalRewards.mul(50).div(1000);

        // We need to find a better way to test it!
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.emit(stakePool, "LogClaimRewards")
          .withArgs(supplier1.address, totalRewards.sub(penalty), dexPool.address);
      });

      it("should be able to update the penalty for early claiming", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, balance2, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        const penalyzationFee = 700 // 7%
        await stakePool.setPenalizationFee(penalyzationFee);

        await expect(dexPool.connect(supplier2).approve(stakePool.address, balance2))
          .not.to.be.reverted;

        await expect(stakePool.connect(supplier2).stakeToken(balance2, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(1);

        await time.increase(day * 6);

        const totalRewards = await stakePool.getTotalRewards(dexPool.address, supplier2.address);
        
        const penalty = totalRewards.mul(penalyzationFee).div(factor);

        await expect(stakePool.connect(supplier1).stakeToken(balance2, dexPool.address, month))
          .not.to.be.reverted;
        
        await time.increase(day * 6);       

        // We need to find a better way to test it!
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.emit(stakePool, "LogClaimRewards")
          .withArgs(supplier1.address, totalRewards.sub(penalty), dexPool.address);
      });

      it("should not be able to claim if user is not staking", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        
        await expect(stakePool.connect(supplier1).claimRewards(dexPool.address))
          .to.be.revertedWith("nothing to claim!");

      });

  });
  describe("Test staking pool adjustments", () => {
      it("Should be able to add more Inject tokens to reserve", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        const initialReserves = (await stakePool.poolInfo(dexPool.address)).poolReserves;

        dexPool.connect(supplier1).approve(stakePool.address, balance1)

        await injectToken.approve(stakePool.address, ONE);

        await stakePool.addStakingPoolReserves(ONE, dexPool.address);

        const newReserves = (await stakePool.poolInfo(dexPool.address)).poolReserves;

        expect(newReserves).to.be.equal(initialReserves.add(ONE));
      });

      it("Should be able to adjust the max staking time", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await stakePool.setMaxDuration(month * 2);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, 3 * month))
          .to.be.revertedWith("duration not allowed!");

        await stakePool.setMaxDuration(month * 5);

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, 5 * month))
          .not.to.be.reverted;

      });

      it("Should not be possible to stake when paused", async () => {
        const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

        await stakePool.pause();

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, 3 * month))
          .to.be.revertedWith("Pausable: paused");

        await stakePool.unpause();

        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, 3 * month))
          .not.to.be.reverted;

      });

      it("should be able to remove reserves form a Pool", async () => {
          const { dexPool, stakePool, injectToken, dai, supplier1, balance1, wethAmount, daiAmount } = await loadFixture(setStakingPool);

          await injectToken.approve(stakePool.address, ONE);
          await stakePool.addStakingPoolReserves(ONE, dexPool.address);

          const initBalance = (await stakePool.poolInfo(dexPool.address)).poolReserves;;

          const _stakePool = await stakePool.poolInfo(dexPool.address);
          await stakePool.removeStakingPoolReserves(ONE, dexPool.address);
          const newBalance = (await stakePool.poolInfo(dexPool.address)).poolReserves;
          
          expect(newBalance).to.be.equal(initBalance.sub(ONE));
      });

      it("Should be able to stake", async () => {
        const { dexPool, injectToken, stakePool, weth, dai, supplier1, balance1, supplier2, wethAmount, daiAmount } = await loadFixture(setStakingPool);
        const balanceBefore = await injectToken.balanceOf(supplier1.address);
        await expect(stakePool.connect(supplier1).stakeToken(balance1, dexPool.address, month))
          .not.to.be.reverted;

        await time.increase(month);

        await stakePool.connect(supplier1).claimRewards(dexPool.address);

        const balanceAfter = await injectToken.balanceOf(supplier1.address);
      });

  });
});

import { loadFixture, } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers, network } from "hardhat";
import bn  from 'bignumber.js';


const initialTokens = utils.parseEther("1000");
const fees = 30; //.3%
const _ownerFees = 10; //.1%
const ZERO = utils.parseEther("0");
const ONE = utils.parseEther("1");
const TWO = utils.parseEther("2");
const FIVE = utils.parseEther("5");
const FIFTY = "50";
const ONEHUNDRED = "100";
const ONEMILLION = "1000000";
const TEN = "10";
const factor = 10000;
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
    
    await weth.connect(supplier1).deposit({value: initialTokens});
    await weth.connect(supplier2).deposit({value: initialTokens});
    await weth.connect(trader1).deposit({value: initialTokens});
    await weth.connect(trader2).deposit({value: initialTokens});

    await dai.transfer(supplier1.address, initialTokens);
    await dai.transfer(supplier2.address, initialTokens);
    await dai.transfer(trader1.address, initialTokens);
    await dai.transfer(trader2.address, initialTokens);

    return { poolFactory, dexRouter,  weth, dai, owner, supplier1, supplier2, trader1, trader2, account1 };
  }
  async function beforeAddingLiquidity() {
    const { poolFactory, dexRouter, weth, dai, owner, supplier1, supplier2, trader1, trader2} = await loadFixture(deployPoolFactory);

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

    await weth.connect(trader1).approve(dexRouter.address, wethAmount);
    await dai.connect(trader1).approve(dexRouter.address, daiAmount);

    await weth.connect(trader2).approve(dexRouter.address, wethAmount);
    await dai.connect(trader2).approve(dexRouter.address, daiAmount);

    const dexPool = await ethers.getContractAt("DexPool", poolAddress);

    return {wethAmount, daiAmount, poolAddress, dexPool, poolFactory, dexRouter, weth, dai, owner, supplier1, trader1, supplier2, trader2}
  }

  async function beforeSwaping() {
    const { wethAmount, daiAmount, poolAddress, poolFactory, dexRouter, weth, dai, owner, supplier1, trader1, supplier2, trader2 } = await loadFixture(beforeAddingLiquidity);
    
    await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

    // comunicate with the pool to verify liquidity.
    const dexPool = await ethers.getContractAt("DexPool", poolAddress);
    expect(await dexPool.initialized()).to.be.equal(true);
        
    // Verify reserves.
    const [reserve0, reserve1, ] = await dexPool.getLatestReserves();

    expect(reserve0).to.be.equal(wethAmount);
    expect(reserve1).to.be.equal(daiAmount);

    return { wethAmount, daiAmount, poolAddress, dexPool, reserve0, reserve1, dexRouter, weth, dai, owner, supplier1, trader1, supplier2, trader2 };
  }

  async function addLiquidityETH() {
        const { poolFactory, dexRouter, weth, dai, supplier1, supplier2, trader1} = await loadFixture(deployPoolFactory);
        const { wethAmount, daiAmount, poolAddress, dexPool } = await loadFixture(beforeAddingLiquidity);

         await expect (dexRouter.connect(supplier1)
          .addLiquidityETH(dai.address, daiAmount, 0, 0, {value: wethAmount}))
          .not.to.be.reverted;

        return { poolFactory, dexRouter, weth, dai, supplier1, supplier2, trader1, poolAddress, dexPool, wethAmount, daiAmount}
  }

  describe("Test add liquidity feature (token , token)", () => {
      it("Should be able to add liquidity", async () => {
        const { dexRouter, weth, dai, supplier1,wethAmount, daiAmount } = await loadFixture(beforeAddingLiquidity);

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;
      });

      it("Should be able to calculate the token ratio before adding liquidity", async () => {
        const { dexRouter, weth, dai, supplier1,wethAmount, daiAmount } = await loadFixture(beforeAddingLiquidity);
        
        const amountOut = await dexRouter.getTokenPairRatio(weth.address, dai.address, FIVE);
        expect(amountOut).to.be.equal(ZERO);
      });

      it("Should be able to add liquidity in reverse order", async () => {
        const { dexRouter, weth, dai, supplier1, wethAmount, daiAmount } = await loadFixture(beforeAddingLiquidity);

        await expect (dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(dai.address, weth.address, daiAmount, wethAmount, 0, 0))
          .not.to.be.reverted;
      });

      it("Should validate reserves after adding liquidity", async () => {
        const { poolFactory, dexRouter, weth, dai, supplier1, trader1, wethAmount, daiAmount, poolAddress, dexPool } = await loadFixture(beforeAddingLiquidity);

        await dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0);
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        expect(newReserve0).to.be.equal(wethAmount);
        expect(newReserve1).to.be.equal(daiAmount);
      });

      it("Should validate reserves after adding liquidity in reverse order", async () => {
        const { wethAmount, daiAmount, poolAddress, dexPool, dexRouter, weth, dai, supplier1, } = await loadFixture(beforeAddingLiquidity);

        await dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(dai.address, weth.address, daiAmount, wethAmount, 0, 0);

        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        expect(newReserve0).to.be.equal(wethAmount);
        expect(newReserve1).to.be.equal(daiAmount);  
      });

      it("Should validate zero values after adding liquidity", async () => {
        const { wethAmount, daiAmount, dexRouter, weth, dai, supplier1 } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(dai.address, weth.address, ZERO, wethAmount, 0, 0))
          .to.be.revertedWith("TokenA amount is zero!");

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(dai.address, weth.address, daiAmount, ZERO, 0, 0))
          .to.be.revertedWith("TokenB amount is zero!");
      });

      it("Should validate zero addresses after adding liquidity", async () => {
        const { dexRouter, weth, dai, supplier1, wethAmount, daiAmount } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, ZeroAddress, wethAmount, daiAmount, 0, 0))
          .to.be.revertedWith("token address should not be zero!");

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(ZeroAddress, dai.address, wethAmount, daiAmount, 0, 0))
          .to.be.revertedWith("token address should not be zero!");
      });

      it("Should validate TokenB amount desired", async () => {
        const { wethAmount, daiAmount, dexPool, dexRouter, weth, dai, supplier1 } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.div(2), daiAmount.div(2), 0, 0))
          .not.to.be.reverted;

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.div(2), daiAmount, 0, 0))
          .not.to.be.reverted;

        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        expect(newReserve0).to.be.equal(wethAmount);
        expect(newReserve1).to.be.equal(daiAmount); 

      });

      // Important: Check this test!
      it("Should validate TokenA amount desired", async () => {
        const { wethAmount, daiAmount, dexPool, dexRouter, weth, dai, supplier1} = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount.div(2), daiAmount.div(2), 0, 0))
          .not.to.be.reverted;

        const amountOut = await dexRouter.getTokenPairRatio(dai.address, weth.address, daiAmount.div(2));
        
        await expect(dexRouter.connect(supplier1)
          .addTokenToTokenLiquidity(dai.address, weth.address, daiAmount.div(2), amountOut, 0, 0))
          .not.to.be.reverted;

        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        expect(newReserve0).to.be.equal(wethAmount.div(2).add(amountOut));
        expect(newReserve1).to.be.equal(daiAmount);
      });
  });

  describe("Test add liquidity feature (token to Ether)", () => {
      it("Should be able to add liquidity", async () => {
        const { wethAmount, daiAmount, dexRouter, dai, supplier1} = await loadFixture(beforeAddingLiquidity);

         await expect (dexRouter.connect(supplier1)
          .addLiquidityETH(dai.address, daiAmount, 0, 0, {value: wethAmount}))
          .not.to.be.reverted;
      });

      it("Should be able to transfer shares", async () => {
        const { wethAmount, daiAmount, dexRouter, dexPool, dai, supplier1, supplier2} = await loadFixture(beforeAddingLiquidity);

        await expect (dexRouter.connect(supplier1)
          .addLiquidityETH(dai.address, daiAmount, 0, 0, {value: wethAmount}))
          .not.to.be.reverted;

        expect(await dexPool.balanceOf(supplier2.address)).to.be.equal(ZERO);
        const shares = await dexPool.balanceOf(supplier1.address);
        
        await dexPool.connect(supplier1).transfer(supplier2.address, shares);

        expect(await dexPool.balanceOf(supplier1.address)).to.be.equal(ZERO);
        expect(await dexPool.balanceOf(supplier2.address)).to.be.equal(shares);

      });

      it("Should validate token reserves", async () => {
        const { wethAmount, daiAmount, dexPool, dexRouter, dai, supplier1 } = await loadFixture(beforeAddingLiquidity);

         await dexRouter.connect(supplier1).addLiquidityETH(dai.address, daiAmount, 0, 0, {value: wethAmount});

        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        expect(newReserve0).to.be.equal(wethAmount);
        expect(newReserve1).to.be.equal(daiAmount);
      });

      it("Should validate token value not equal to zero", async () => {
        const { wethAmount, dexRouter, dai, supplier1 } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1).addLiquidityETH(dai.address, 0, 0, 0, {value: wethAmount}))
          .to.be.revertedWith("amount desired not equal to zero!");
      });

      it("Should validate token address not equal to zero", async () => {
        const { wethAmount, daiAmount, dexRouter, supplier1 } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1).addLiquidityETH(ZeroAddress, daiAmount, 0, 0, {value: wethAmount}))
          .to.be.revertedWith("token address should not be zero!");
      });

      it("Should validate ether amount not equal to zero", async () => {
        const { daiAmount, dexRouter, weth, dai, supplier1 } = await loadFixture(beforeAddingLiquidity);

        await expect(dexRouter.connect(supplier1).addLiquidityETH(dai.address, daiAmount, 0, 0, {value: 0}))
          .to.be.revertedWith("ether amount not equal to zero!");
      });

  });

  describe("Test Router Contract", () => {
      it("Should swap using the router", async () => {
        const { reserve0, reserve1, dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);
        
        const amountIn = ONE;
        
        const ownerFees = await dexRouter.ownerFees();
        
        const _amountIn = amountIn.mul(factor - ownerFees.toNumber()).div(factor);

        await weth.connect(trader1).approve(dexRouter.address, amountIn);
        
        const minAmountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, amountIn);
      
        const amountInWithFees = _amountIn.mul(factor - fees).div(factor);
        const _minAmountOut = (reserve1.mul(amountInWithFees)).div(reserve0.add(amountInWithFees));
        
        expect(minAmountOut).to.be.equal(_minAmountOut);
        
        await expect(dexRouter.connect(trader1)
          .swapTokensWithFees(weth.address, dai.address, amountIn, minAmountOut))
          .not.to.be.revertedWith;
      });

      it("Should emit an event when calling dexRouter contract ", async () => {
        const { dexPool, dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);

        const amountIn = FIVE;

        await weth.connect(trader1).approve(dexRouter.address, amountIn);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, amountIn);

        await expect(dexRouter.connect(trader1)
              .swapTokensWithFees(weth.address, dai.address, amountIn, amountOut))
          .to.emit(dexRouter, "LogSwapTokensWithFees")
          .withArgs(
              trader1.address, 
              weth.address,
              dai.address,
              dexPool.address,
              fees,
              amountIn,
              amountOut);
      });
   });

  describe("Test Remove Liquidity Token to Token", () => {
      it("Should be able to obtain the users shares", async () => {
        const { dexPool, wethAmount, daiAmount, supplier1 } = await loadFixture(beforeSwaping);
        
        const shares = await dexPool.balanceOf(supplier1.address);
        const value = new bn(wethAmount.mul(daiAmount).toString());
        const _shares = value.sqrt().toFixed().toString().split(".")[0];

        const _totalSupply = await dexPool.totalSupply();
        expect(_totalSupply).to.be.equal(_shares)
        expect(shares).to.be.equal(_shares);
      });

      it("Should be able to remove all liquidity", async () => {
        const { dexPool, dexRouter, weth, dai, supplier1 } = await loadFixture(beforeSwaping);
        
        const shares = await dexPool.balanceOf(supplier1.address);

        await dexPool.connect(supplier1).approve(dexRouter.address, shares);

        await dexRouter.connect(supplier1).removeLiquidity(weth.address, dai.address, shares, 0, 0, supplier1.address);

        const newShares = await dexPool.balanceOf(supplier1.address);

        const _totalSupply = await dexPool.totalSupply();

        expect(newShares).to.be.equal(ZERO);
        expect(_totalSupply).to.be.equal(ZERO);
      });

      it("Should be able to emit an event", async () => {
        const { dexPool, dexRouter, weth, dai, supplier1 } = await loadFixture(beforeSwaping);
        
        const shares = await dexPool.balanceOf(supplier1.address);

        await dexPool.connect(supplier1).approve(dexRouter.address, shares);

        await dexRouter.connect(supplier1).removeLiquidity(weth.address, dai.address, shares, 0, 0, supplier1.address);

        const newShares = await dexPool.balanceOf(supplier1.address);

        const _totalSupply = await dexPool.totalSupply();

        expect(newShares).to.be.equal(ZERO);
        expect(_totalSupply).to.be.equal(ZERO);
      });

      it("Should be able to remove part of the liquidity", async () => {
        const { dexPool, wethAmount, daiAmount, dexRouter, weth, dai, supplier1, supplier2 } = await loadFixture(beforeSwaping);
        
        const shares1 = await dexPool.balanceOf(supplier1.address);

        await weth.connect(supplier2).approve(dexRouter.address, wethAmount);
        await dai.connect(supplier2).approve(dexRouter.address, daiAmount);

        await expect (dexRouter.connect(supplier2)
          .addTokenToTokenLiquidity(weth.address, dai.address, wethAmount, daiAmount, 0, 0))
          .not.to.be.reverted;

        const shares2 = await dexPool.balanceOf(supplier2.address);

        const _totalSupply = await dexPool.totalSupply();
        expect(_totalSupply).to.be.equal(shares1.add(shares2));

        await dexPool.connect(supplier2).approve(dexRouter.address, shares2);
        await dexRouter.connect(supplier2).removeLiquidity(weth.address, dai.address, shares2, 0, 0, supplier2.address);

        const newShares2 = await dexPool.balanceOf(supplier2.address);

        expect(newShares2).to.be.equal(ZERO);

        const _newTotalSupply = await dexPool.totalSupply();
        expect(_newTotalSupply).to.be.equal(shares1);
      });
  });

  describe("Test Remove Liquidity Ether to Token", () => {
      it("Should be able to obtain the users shares", async () => {
        const { dexPool, supplier1, wethAmount, daiAmount} = await loadFixture(addLiquidityETH);
        
        const shares = await dexPool.balanceOf(supplier1.address);
        const value = new bn(wethAmount.mul(daiAmount).toString());
        const _shares = value.sqrt().toFixed().toString().split(".")[0];

        const _totalSupply = await dexPool.totalSupply();
        expect(_totalSupply).to.be.equal(_shares)
        expect(shares).to.be.equal(_shares);
      });

      it("Should be able to remove all liquidity", async () => {
        const { dexRouter, dexPool, weth, dai, supplier1} = await loadFixture(addLiquidityETH);
        
        const shares = await dexPool.balanceOf(supplier1.address);

        await dexPool.connect(supplier1).approve(dexRouter.address, shares);

        await dexRouter.connect(supplier1).removeLiquidityETH(dai.address, shares, 0, 0,supplier1.address);

        const newShares = await dexPool.balanceOf(supplier1.address);

        const _totalSupply = await dexPool.totalSupply();

        expect(newShares).to.be.equal(ZERO);
        expect(_totalSupply).to.be.equal(ZERO);
      });

      it("Should be able to partially remove liquidity", async () => {
        const { dexRouter, dexPool, dai, supplier1, supplier2, wethAmount, daiAmount} = await loadFixture(addLiquidityETH);
        
        const shares1 = await dexPool.balanceOf(supplier1.address);

        await dai.connect(supplier2).approve(dexRouter.address, daiAmount);

        await expect (dexRouter.connect(supplier2)
          .addLiquidityETH(dai.address, daiAmount, 0, 0, {value: wethAmount}))
          .not.to.be.reverted;

        const shares2 = await dexPool.balanceOf(supplier2.address);

        const _totalSupply = await dexPool.totalSupply();
        expect(_totalSupply).to.be.equal(shares1.add(shares2));

        await dexPool.connect(supplier2).approve(dexRouter.address, shares2);
        await dexRouter.connect(supplier2).removeLiquidityETH(dai.address, shares2, 0, 0, supplier2.address);

        const newShares2 = await dexPool.balanceOf(supplier2.address);

        expect(newShares2).to.be.equal(ZERO);

        const _newTotalSupply = await dexPool.totalSupply();
        expect(_newTotalSupply).to.be.equal(shares1);
      });
  });

  
  describe("Test Swap Token to Token", () => {
      it("Should be able to swap Token to Token",  async () => {
        const { daiAmount, dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);

        await expect(
          dexRouter.connect(trader1).swapTokensWithFees(weth.address, dai.address, ONE, amountOut)
        ).not.to.be.reverted;

        const _amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        await expect(
          dexRouter.connect(trader1).swapTokensWithFees(dai.address, weth.address, daiAmount, _amountOut)
        ).not.to.be.reverted;
      });

      it("Should validate token balance changes", async () => {
        const { daiAmount, dexRouter, weth, dai, supplier1, trader1 } = await loadFixture(beforeSwaping);

        const daiBalanceBefore = await dai.balanceOf(trader1.address);
        const wethBalanceBefore = await weth.balanceOf(trader1.address);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);
        
        await dexRouter.connect(trader1).swapTokensWithFees(dai.address, weth.address, daiAmount, amountOut)
        
        const daiBalanceAfter = await dai.balanceOf(trader1.address);
        const wethBalanceAfter = await weth.balanceOf(trader1.address);

        expect(daiAmount).to.be.equal(daiBalanceBefore.sub(daiBalanceAfter));
        expect(amountOut).to.be.equal(wethBalanceAfter.sub(wethBalanceBefore))
      });

      it("Should validate weth to dai reserve changes", async () => {
        const { dexPool, reserve0, reserve1, dexRouter, weth, dai, trader1} = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);

        await dexRouter.connect(trader1)
                       .swapTokensWithFees(weth.address, dai.address, ONE, amountOut)
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        const ownerFees = ONE.mul(_ownerFees).div(factor);

        expect(newReserve0).to.be.equal(reserve0.add(ONE.sub(ownerFees)));
        expect(newReserve1).to.be.equal(reserve1.sub(amountOut));
      });

      it("Should validate dai to weth reserve changes", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, trader1} = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        await dexRouter.connect(trader1)
                       .swapTokensWithFees(dai.address, weth.address, daiAmount, amountOut)
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        const ownerFees = daiAmount.mul(_ownerFees).div(factor);

        // Remember that some fees are send to the dexRouter owner. 
        expect(newReserve0).to.be.equal(reserve0.sub(amountOut));
        expect(newReserve1).to.be.equal(reserve1.add(daiAmount.sub(ownerFees)));
      });

      it("Should validate that the contract owner receives the fees", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, owner, trader1} = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        const ownerFees = await dexRouter.ownerFees();

        expect(_ownerFees).to.be.equal(ownerFees);

        const feesAmount = daiAmount.mul(_ownerFees).div(factor);

        await expect(
            dexRouter.connect(trader1)
                     .swapTokensWithFees(dai.address, weth.address, daiAmount, amountOut)
        ).to.changeTokenBalances(dai, [owner], [feesAmount]);
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        // Remember that some fees are send to the dexRouter owner. 
        expect(newReserve0).to.be.equal(reserve0.sub(amountOut));
        expect(newReserve1).to.be.equal(reserve1.add(daiAmount.sub(feesAmount)));
      });
      it("Should allow to update the owner fees", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, owner, trader1} = await loadFixture(beforeSwaping);

        const newOwnerFees = 100;
        await dexRouter.setNewOwnerFees(newOwnerFees);

        const ownerFees = await dexRouter.ownerFees();
        expect(newOwnerFees).to.be.equal(ownerFees);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        const feesAmount = daiAmount.mul(newOwnerFees).div(factor);
        await expect(
            dexRouter.connect(trader1)
                     .swapTokensWithFees(dai.address, weth.address, daiAmount, amountOut)
        ).to.changeTokenBalances(dai, [owner], [feesAmount]);
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        // Remember that some fees are send to the dexRouter owner. 
        expect(newReserve0).to.be.equal(reserve0.sub(amountOut));
        expect(newReserve1).to.be.equal(reserve1.add(daiAmount.sub(feesAmount)));
      });

      it("Should validate that the new owner receives token fees", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, owner, trader1, trader2} = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);
        const ownerFees = await dexRouter.ownerFees();

        expect(_ownerFees).to.be.equal(ownerFees);
        const feesAmount = daiAmount.mul(_ownerFees).div(factor);

        await dexRouter.transferOwnership(trader2.address);

        await expect(
            dexRouter.connect(trader1)
                     .swapTokensWithFees(dai.address, weth.address, daiAmount, amountOut)
        ).to.changeTokenBalances(dai, [trader2], [feesAmount]);
        
      });
  });

  describe("Test Swap Ether to Token", () => {
      it("Should be able to swap Ether to Token",  async () => {
        const { dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);

        await expect(
          dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut, {value: ONE})
        ).not.to.be.reverted;
      });

      it("Should validate balance changes", async () => {
        const { dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);

        const daiBalanceBefore = await dai.balanceOf(trader1.address);
        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);

        await expect(
          dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut, {value: ONE})
        ).to.changeEtherBalance(trader1, ONE.mul(-1));

        const daiBalanceAfter = await dai.balanceOf(trader1.address);

        expect(amountOut).to.be.equal(daiBalanceAfter.sub(daiBalanceBefore));
      });

      it("Should validate reserve changes", async () => {
        const { dexPool, reserve0, reserve1, dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);
        
        const amountIn = ONE;
       
        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, amountIn);

        await dexRouter.connect(trader1)
                       .swapETHForTokens(dai.address, amountOut, {value: amountIn})
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        const _ownerFees = amountIn.mul(10).div(factor);
        const _amountInReserve0 = amountIn.sub(_ownerFees);

        expect(newReserve0).to.be.equal(reserve0.add(_amountInReserve0));
        expect(newReserve1).to.be.equal(reserve1.sub(amountOut));
      });

      it("Should allow owner to withdraw Ether fees",  async () => {
        const { dexRouter, weth, dai, owner, trader1 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);

        const _ownerFees = await dexRouter.ownerFees();

        const ownerFees = ONE.mul(_ownerFees).div(factor);

        await expect(
          dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut, {value: ONE})
        ).not.to.be.reverted;

        await expect(
          dexRouter.withdrawEtherFees()           
        ).to.changeEtherBalance(owner, ownerFees);

      });

      it("Should validate that only the owner is able to withdraw Ether funds", async () => {
        const { dexRouter, weth, dai, owner, trader1 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);
        const _ownerFees = await dexRouter.ownerFees();

        const ownerFees = ONE.mul(_ownerFees).div(factor);

        await expect(
          dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut, {value: ONE})
        ).not.to.be.reverted;

        await expect(dexRouter.connect(trader1).withdrawEtherFees())
          .to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should allow the new owner to withdraw Ether funds", async () => {
        const { dexRouter, weth, dai, owner, trader1, trader2 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(weth.address, dai.address, ONE);
        const _ownerFees = await dexRouter.ownerFees();

        const ownerFees = ONE.mul(_ownerFees).div(factor);

        await expect(
          dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut, {value: ONE})
        ).not.to.be.reverted;

        await dexRouter.transferOwnership(trader2.address);

        await expect(
          dexRouter.connect(trader2).withdrawEtherFees()           
        ).to.changeEtherBalance(trader2, ownerFees);
      });

      it("Should validate that the owner can withdraw multiple Ether fees",  async () => {
        const { dexRouter, weth, dai, owner, trader1, trader2 } = await loadFixture(beforeSwaping);

        const FIRST_TRADE = ONE;
        const SECOND_TRADE = TWO;
        const THIRD_TRADE = FIVE
        const TOTAL_TRADE = FIRST_TRADE.add(SECOND_TRADE).add(THIRD_TRADE);

        const ownerFees = await dexRouter.ownerFees();
        const fees = TOTAL_TRADE.mul(ownerFees).div(factor);

        const amountOut1 = await dexRouter.getTokenAmountOut(weth.address, dai.address, FIRST_TRADE );
        await dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut1, {value: FIRST_TRADE});

        const amountOut2 = await dexRouter.getTokenAmountOut(weth.address, dai.address, SECOND_TRADE );
        await dexRouter.connect(trader2).swapETHForTokens(dai.address, amountOut2, {value: SECOND_TRADE})

        const amountOut3 = await dexRouter.getTokenAmountOut(weth.address, dai.address, THIRD_TRADE );
        await dexRouter.connect(trader1).swapETHForTokens(dai.address, amountOut3, {value: THIRD_TRADE})

        await expect(
          dexRouter.withdrawEtherFees()           
        ).to.changeEtherBalance(owner, fees);

      });
  });

  describe("Test Swap Token to Ether", () => {
      it("Should be able to swap Ether to Token",  async () => {
        const { dexRouter, weth, dai, trader1, daiAmount } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        await expect(
          dexRouter.connect(trader1).swapTokensForETH(dai.address, daiAmount, amountOut)
        ).not.to.be.reverted;
      });

      it("Should validate trader's balance changes", async () => {
        const { dexRouter, weth, dai, trader1, daiAmount } = await loadFixture(beforeSwaping);

        const daiBalanceBefore = await dai.balanceOf(trader1.address);
        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        await expect(
          dexRouter.connect(trader1).swapTokensForETH(dai.address, daiAmount, amountOut)
        ).to.changeEtherBalance(trader1, amountOut);

        const daiBalanceAfter = await dai.balanceOf(trader1.address);

        expect(daiAmount).to.be.equal(daiBalanceBefore.sub(daiBalanceAfter));
      });

      it("Should validate reserve changes", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, trader1 } = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        await dexRouter.connect(trader1).swapTokensForETH(dai.address, daiAmount, amountOut)
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        const _ownerFees = daiAmount.mul(10).div(factor);
        const _daiInReserve = daiAmount.sub(_ownerFees);

        expect(newReserve0).to.be.equal(reserve0.sub(amountOut));
        expect(newReserve1).to.be.equal(reserve1.add(_daiInReserve));
      });

      it("Should validate that the contract owner receives the token fees", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, owner, trader1} = await loadFixture(beforeSwaping);

        const amountOut = await dexRouter.getTokenAmountOut(dai.address, weth.address, daiAmount);

        const ownerFees = await dexRouter.ownerFees();

        const feesAmount = daiAmount.mul(_ownerFees).div(factor);

        await expect( 
            dexRouter.connect(trader1).swapTokensForETH(dai.address, daiAmount, amountOut)
        ).to.changeTokenBalances(dai, [owner], [feesAmount]);
        
        const [newReserve0, newReserve1, ] = await dexPool.getLatestReserves();

        // Remember that some fees are send to the dexRouter owner. 
        expect(newReserve0).to.be.equal(reserve0.sub(amountOut));
        expect(newReserve1).to.be.equal(reserve1.add(daiAmount.sub(feesAmount)));
      });

      it("Should validate that the contract owner receives multiple token fees", async () => {
        const { dexPool, reserve0, reserve1, daiAmount, dexRouter, weth, dai, owner, trader1, trader2} = await loadFixture(beforeSwaping);

        const FIRST_TRADE = ONE;
        const SECOND_TRADE = TWO;
        const THIRD_TRADE = FIVE
        const TOTAL_TRADE = FIRST_TRADE.add(SECOND_TRADE).add(THIRD_TRADE);

        const ownerFees = await dexRouter.ownerFees();
        const fees = TOTAL_TRADE.mul(ownerFees).div(factor);

        const daiBalanceBefore = await dai.balanceOf(owner.address);
        const amountOut1 = await dexRouter.getTokenAmountOut(dai.address, weth.address, FIRST_TRADE);
        await dexRouter.connect(trader1).swapTokensForETH(dai.address, FIRST_TRADE, amountOut1)
        
        const amountOut2 = await dexRouter.getTokenAmountOut(dai.address, weth.address, SECOND_TRADE);
        await dexRouter.connect(trader2).swapTokensForETH(dai.address, SECOND_TRADE, amountOut2)

        const amountOut3 = await dexRouter.getTokenAmountOut(dai.address, weth.address, THIRD_TRADE);
        await dexRouter.connect(trader1).swapTokensForETH(dai.address, THIRD_TRADE, amountOut3)

        const daiBalanceAfter = await dai.balanceOf(owner.address);

        const earnDaiFees = daiBalanceAfter.sub(daiBalanceBefore);

        expect(earnDaiFees).to.be.equal(fees);
        
      });
  });
});

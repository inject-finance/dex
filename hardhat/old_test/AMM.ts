import { loadFixture, } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers } from "hardhat";
import bn  from 'bignumber.js';


const initialTokens = utils.parseEther("1000");
const fees = 3;
const ZERO = 0;
const FIFTY = "50";
const ONEHUNDRED = "100";
const ONEMILLION = "1000000";
const TEN = "10";
const factor = 1000;

describe("Automated Market Maker Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  
  async function deployAMM() {
    // Contracts are deployed using the first signer/account by default
    const [owner, supplier1, supplier2, trader1, trader2, account1] = await ethers.getSigners();

    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();
    await weth.deployed();

    const DAI = await ethers.getContractFactory("DAI");
    const dai = await DAI.deploy();
    await dai.deployed();

    const AMM = await ethers.getContractFactory("AMM");
    const amm = await AMM.deploy(weth.address, dai.address, fees);
    await amm.deployed();

    await weth.transfer(supplier1.address, initialTokens);
    await weth.transfer(supplier2.address, initialTokens);
    await weth.transfer(trader1.address, initialTokens);
    await weth.transfer(trader2.address, initialTokens);

    await dai.transfer(supplier1.address, initialTokens);
    await dai.transfer(supplier2.address, initialTokens);
    await dai.transfer(trader1.address, initialTokens);
    await dai.transfer(trader2.address, initialTokens);

    return { amm, weth, dai, owner, supplier1, supplier2, trader1, trader2, account1 };
  }

  async function approvedSupplies() {
    const { amm, weth, dai, supplier1, supplier2} = await loadFixture(deployAMM);
    const wethAmount = utils.parseEther(FIFTY);
    const daiAmount = utils.parseEther(ONEHUNDRED);
    
    await weth.connect(supplier1).approve(amm.address, wethAmount);
    await dai.connect(supplier1).approve(amm.address, daiAmount);

    await weth.connect(supplier2).approve(amm.address, wethAmount);
    await dai.connect(supplier2).approve(amm.address, daiAmount);

    return { wethAmount, daiAmount};
  }

  async function addLiquidity() {
    const { amm, weth, dai, supplier1, supplier2} = await loadFixture(deployAMM);
    const { wethAmount, daiAmount } = await loadFixture(approvedSupplies);

    await amm.connect(supplier1).addLiquidity(wethAmount, daiAmount);
    await amm.connect(supplier2).addLiquidity(wethAmount, daiAmount);

    const reserve0 = await amm.reserve0();
    const reserve1 = await amm.reserve1();

    return { reserve0, reserve1, wethAmount, daiAmount };
  }

  describe("Contract deployment", function () {
    it("Should set the right owner", async () => {
      const { amm, owner} = await loadFixture(deployAMM);
      expect(await amm.owner()).to.equal(owner.address);
    });

    it("Should validate info related to the tokens", async  () => {
      const { amm, weth, dai, owner} = await loadFixture(deployAMM);

      const token0 = await amm.token0();
      const token1 = await amm.token1();

      const _weth = await ethers.getContractAt(
        "WETH", 
        token0
      );

      const _dai = await ethers.getContractAt(
        "DAI", 
        token1
      );

      expect(await _weth.name()).to.equal("My WETH");
      expect(await _weth.symbol()).to.equal("WETH");

      expect(await _dai.name()).to.equal("My DAI");
      expect(await _dai.symbol()).to.equal("DAI");

      const _wethTotalSupply = await _weth.totalSupply();
      
      expect(
        BigNumber.from(_wethTotalSupply)
      ).to.equal(utils.parseEther(ONEMILLION));

      const _daiTotalSupply = await _dai.totalSupply();
       expect(
        BigNumber.from(_daiTotalSupply)
      ).to.equal(utils.parseEther(ONEMILLION));
    });

    it("Should set swapping fees", async () => {
      const { amm, owner } = await loadFixture(deployAMM);
      expect(await amm.fees()).to.equal(fees);
    });
  });

  describe("Add liquidity to the Pool and Swap", () => {
   describe("Validating fee value", () => {
      it("Should be able to change swapping fees", async () => {
        const { amm, owner } = await loadFixture(deployAMM);
        const newFees = ZERO;

        await amm.setLiquidityPoolFees(newFees);
        expect(await amm.fees()).to.equal(newFees);
      });

      it("Should not be able to change swapping fees if not owner", async () => {
        const { amm, owner, account1 } = await loadFixture(deployAMM);
        const newFees = 4;

        await expect(amm.connect(account1).setLiquidityPoolFees(newFees))
          .to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should be a different new fee value", async () => {
        const { amm } = await loadFixture(deployAMM);
        const newFees = fees;

        await expect(amm.setLiquidityPoolFees(newFees))
          .to.be.revertedWith("fees should be different!");
      });

      it("Should emit an event", async () => {
        const { amm, owner} = await loadFixture(deployAMM);
        const newFees = 4;

        await expect(amm.setLiquidityPoolFees(newFees))
            .to.emit(amm, "LogSetNewFees")
            .withArgs(newFees, owner.address)
        });
      });

      describe("Add liquidity", async () => {
        it("Should provide enough allowance to the AMM", async () => {
          const { amm, supplier1} = await loadFixture(deployAMM);

          const value0 = utils.parseEther(FIFTY);
          const value1 = utils.parseEther(ONEHUNDRED); 

          await expect(amm.connect(supplier1).addLiquidity(value0, value1))
            .to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("Should provide enough allowance to both tokens to the AMM", async () => {
          const { amm, weth, dai, supplier1} = await loadFixture(deployAMM);
          await weth.connect(supplier1).approve(amm.address, 50);

          await expect(amm.connect(supplier1).addLiquidity(50, 100))
            .to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("Should provide enough allowance to both tokens to the AMM", async () => {
          const { amm, weth, dai, supplier1} = await loadFixture(deployAMM);

          const wetherSupply = utils.parseEther(FIFTY);
          const daiSuppply = utils.parseEther(ONEHUNDRED);

          await weth.connect(supplier1).approve(amm.address, wetherSupply);
          await dai.connect(supplier1).approve(amm.address, daiSuppply);
          await amm.connect(supplier1).addLiquidity(wetherSupply,daiSuppply);
        });

        it("Should emit an event when adding liquidity", async () => {
          const { amm, supplier1} = await loadFixture(deployAMM);
          const { wethAmount, daiAmount} = await loadFixture(approvedSupplies);

          const _weth = BigNumber.from(wethAmount);
          const _dai = BigNumber.from(daiAmount) 

          const value = new bn(_weth.mul(_dai).toString());
          
          const _shares = (value.sqrt()).toFixed().toString().split(".")[0];
          
          await expect(amm.connect(supplier1).addLiquidity(wethAmount, daiAmount))
            .to.emit(amm, "LogAddLiquidity")
            .withArgs(wethAmount, daiAmount, _shares, supplier1.address, wethAmount, daiAmount);
        });

       it("Should validate reserves", async () => {
          const { amm, supplier1} = await loadFixture(deployAMM);
          const { wethAmount, daiAmount} = await loadFixture(approvedSupplies);

          await amm.connect(supplier1).addLiquidity(wethAmount, daiAmount);

          const reserve0 = await amm.reserve0();
          const reserve1 = await amm.reserve1();
          
          expect(reserve0).to.be.equal(wethAmount);
          expect(reserve1).to.be.equal(daiAmount);
        });

        it("Should validate reserves after multiples liquidity supplies", async () => {
          const { amm, supplier1,supplier2} = await loadFixture(deployAMM);
          const { wethAmount, daiAmount} = await loadFixture(approvedSupplies);

          await amm.connect(supplier1).addLiquidity(wethAmount, daiAmount);
          await amm.connect(supplier2).addLiquidity(wethAmount, daiAmount);
          
          const reserve0 = await amm.reserve0();
          const reserve1 = await amm.reserve1();
          
          expect(reserve0).to.be.equal(wethAmount.mul(2));
          expect(reserve1).to.be.equal(daiAmount.mul(2));
        });

        it("Should validate shares after multiples liquidity supplies", async () => {
          const { amm, supplier1,supplier2} = await loadFixture(deployAMM);
          const { wethAmount, daiAmount} = await loadFixture(approvedSupplies);

          await amm.connect(supplier1).addLiquidity(wethAmount, daiAmount);
          await amm.connect(supplier2).addLiquidity(wethAmount, daiAmount);
          
          const reserve0 = await amm.reserve0();
          const reserve1 = await amm.reserve1();
          const totalSupply = await amm.totalSupply();

          const x = wethAmount.mul(totalSupply).div(reserve0);
          const y = daiAmount.mul(totalSupply).div(reserve1);
          
          const shares = bn.min(new bn(x.toString()), new bn(y.toString()));

          expect(shares).to.equal(daiAmount.mul(totalSupply).div(reserve1));
          const supplierBalanceOf = await amm.balanceOf(supplier2.address);

          expect(shares).to.be.equal(supplierBalanceOf);
        });
        
        it("Should validate unbalanced reserves", async () => {
          const { amm, supplier1,supplier2} = await loadFixture(deployAMM);
          const { wethAmount, daiAmount} = await loadFixture(approvedSupplies);

          await amm.connect(supplier1).addLiquidity(wethAmount, daiAmount);
          
          await expect(amm.connect(supplier2).addLiquidity(wethAmount.sub(1), daiAmount))
          .to.be.revertedWith("unbalanced reserves!");

          await expect(amm.connect(supplier2).addLiquidity(wethAmount, daiAmount.sub(1)))
          .to.be.revertedWith("unbalanced reserves!");
        });
    });
    
    describe("Swap with without fees", async () => {

        it("Should validate the amount of tokens out with zero fees", async () => {
          const { amm, weth} = await loadFixture(deployAMM);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await amm.setLiquidityPoolFees(ZERO);

          const tokensIn = utils.parseEther("5")
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          const _tokensOut = reserve1.mul(tokensIn).div(reserve0.add(tokensIn));
          
          expect(tokensOut).to.be.equal(_tokensOut);
        });

        it("Should pre-calculate the same tokensOut amount value, no fees", async () => {
          const { amm, dai, weth, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          await amm.setLiquidityPoolFees(ZERO);

          const daiInitialBalance = await dai.balanceOf(trader1.address);
          
          const tokensIn = utils.parseEther("5");

          await weth.connect(trader1).approve(amm.address, tokensIn);
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          
          await amm.connect(trader1).swap(weth.address, tokensIn);
          const daiNewBalance = (await dai.balanceOf(trader1.address));

          expect(tokensOut).to.be.equal(daiNewBalance.sub(daiInitialBalance));

        });

        it("Should accept zero to pre-calculate the tokensOut, no fees", async () => {
          const { amm, dai, weth, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          await amm.setLiquidityPoolFees(ZERO);

          const tokensIn = utils.parseEther("0");

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          
          expect(tokensOut).to.be.equal(ZERO);

        });

        it("Should be able to swap, no fees", async () => {
          const { amm, dai, weth, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          await amm.setLiquidityPoolFees(ZERO);

          const daiInitialBalance = await dai.balanceOf(trader1.address);
          const wethInitialBalance = await weth.balanceOf(trader1.address);
          
          const tokensIn = utils.parseEther("5");

          await weth.connect(trader1).approve(amm.address, tokensIn);
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          
          await amm.connect(trader1).swap(weth.address, tokensIn);

          const daiNewBalance = (await dai.balanceOf(trader1.address));
          const wethNewBalance = (await weth.balanceOf(trader1.address));

          expect(wethNewBalance).to.be.equal(wethInitialBalance.sub(tokensIn));
          expect(tokensOut).to.be.equal(daiNewBalance.sub(daiInitialBalance));
        });

    });
    describe("Swap with with fees", async () => { 
      it("Should accept zero to pre-calculate the tokensOut, with fees", async () => {
        const { amm, dai, weth, trader1} = await loadFixture(deployAMM);
        const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

        const tokensIn = utils.parseEther(ZERO.toString());

        // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
        const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          
        expect(tokensOut).to.be.equal(ZERO);
      });

      it("Should be able to swap, with fees", async () => {
          const { amm, dai, weth, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);
          
          const daiInitialBalance = await dai.balanceOf(trader1.address);
          const wethInitialBalance = await weth.balanceOf(trader1.address);
          
          const tokensIn = utils.parseEther("5");

          await weth.connect(trader1).approve(amm.address, tokensIn);
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);
          
          await amm.connect(trader1).swap(weth.address, tokensIn);

          const daiNewBalance = (await dai.balanceOf(trader1.address));
          const wethNewBalance = (await weth.balanceOf(trader1.address));

          expect(wethNewBalance).to.be.equal(wethInitialBalance.sub(tokensIn));
          expect(tokensOut).to.be.equal(daiNewBalance.sub(daiInitialBalance));
        });

        it("Should validate the amount of tokens out with fees", async () => {
          const { amm, weth} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          const tokensIn = utils.parseEther("5")
          
          // tokenOut = ( reserves1 * (tokenIn - fees)) / (reserves0 + (tokensIn - fees))
          const tokensOut = await amm.getTokensOutAmount(weth.address, tokensIn);

          const tokensInWithFees = tokensIn.mul(factor - fees).div(factor);
          const _tokensOut = reserve1.mul(tokensInWithFees).div(reserve0.add(tokensInWithFees));
          
          expect(tokensOut).to.be.equal(_tokensOut);
        });

        it("Should not be able to swap when paused", async () => {
          const { amm, weth, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);
          
          await amm.pause();
          
          const tokensIn = utils.parseEther("5");
          await weth.connect(trader1).approve(amm.address, tokensIn);

          await expect(amm.connect(trader1).swap(weth.address, tokensIn))
            .to.be.revertedWith("Pausable: paused");

          await amm.unpause();
          
          await expect(amm.connect(trader1).swap(weth.address, tokensIn))
            .not.to.be.reverted;
        });

        it("Should be add collected fees to the pool", async ()=> {
          const { amm, weth, dai, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);
          
          const tokensIn = utils.parseEther(TEN);
          await weth.connect(trader1).approve(amm.address, tokensIn);

          const wethContractBalanceInit = await weth.balanceOf(amm.address);
          const daiContractBalanceInit = await dai.balanceOf(amm.address);
          
          await expect(amm.connect(trader1).swap(weth.address, tokensIn))
            .not.to.be.reverted;

          const tokensInWithFees = tokensIn.mul((factor - fees)).div(factor)
                    
          const wethContractBalanceEnd = await weth.balanceOf(amm.address);
          expect(wethContractBalanceEnd).to.be.equal(wethContractBalanceInit.add(tokensIn));
          
          const newReserve0 = await amm.reserve0();
          const newReserve1 = await amm.reserve1();

          expect(newReserve0).to.be.equal(wethContractBalanceInit.add(tokensIn));
          const _tokensOut = reserve1.mul(tokensInWithFees).div(reserve0.add(tokensInWithFees));
          expect(newReserve1).to.be.equal(daiContractBalanceInit.sub(_tokensOut ));
        });

        /*it("Should not be able to swap if reserve is not enough", async () => {
          const { amm, weth, dai, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          const tokensIn = reserve0.add(1);
          await weth.connect(trader1).approve(amm.address, tokensIn);

          await expect(amm.connect(trader1).swap(weth.address, tokensIn))
            .to.be.revertedWith("reserve in is not enough!");
        });*/

        it("Should emit an event when swaping", async () => {
          const { amm, weth, dai, trader1} = await loadFixture(deployAMM);
          const { reserve0, reserve1, wethAmount, daiAmount } = await loadFixture(addLiquidity);

          const tokensIn = utils.parseEther(TEN);
          await weth.connect(trader1).approve(amm.address, tokensIn);

          const tokensInWithFees = tokensIn.mul((factor - fees)).div(factor)
          const _tokensOut = reserve1.mul(tokensInWithFees).div(reserve0.add(tokensInWithFees));

          const newReserve0 = reserve0.add(tokensIn);
          const newReserve1 = reserve1.sub(_tokensOut);

          await expect(amm.connect(trader1).swap(weth.address, tokensIn))
            .to.emit(amm, "LogSwapTokens")
            .withArgs(
              trader1.address, fees, weth.address, tokensIn, dai.address, _tokensOut, newReserve0, newReserve1
            );
        });
    });
   
  });
});

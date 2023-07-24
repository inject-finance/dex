import { loadFixture, } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers } from "hardhat";
import bn  from 'bignumber.js';


const initialTokens = utils.parseEther("1000");
const fees = 30; //.3%
const ZERO = utils.parseEther("0");
const FIVE = utils.parseEther("5");
const FIFTY = "50";
const ONEHUNDRED = "100";
const ONEMILLION = "1000000";
const ONE_ETHER = utils.parseEther("1");
const TEN = utils.parseEther("10");
const TENUSDC = utils.parseUnits("10", 6);
const factor = 10000;
const ZeroAddress = ethers.constants.AddressZero;
const decimals = 6;

describe("DEX Pool Test", () => {
  
  async function deployDexPool() {
    // Contracts are deployed using the first signer/account by default
    const [owner, supplier1, supplier2, trader1, trader2, account1] = await ethers.getSigners();

    const WETH = await ethers.getContractFactory("WETH9");
    const weth = await WETH.deploy();
    await weth.deployed();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();
    await usdc.deployed();

    const DexPool = await ethers.getContractFactory("DexPool");
    const dexPool = await DexPool.deploy();
    await dexPool.deployed();
    await dexPool.initialize(weth.address, usdc.address, fees);

    await weth.connect(supplier1).deposit({value: initialTokens});
    await weth.connect(supplier2).deposit({value: initialTokens});
    await weth.connect(trader1).deposit({value: initialTokens});
    await weth.connect(trader2).deposit({value: initialTokens});
    
    await usdc.transfer(supplier1.address, initialTokens);
    await usdc.transfer(supplier2.address, initialTokens);
    await usdc.transfer(trader1.address, initialTokens);
    await usdc.transfer(trader2.address, initialTokens);

    return { dexPool, weth, usdc, owner, supplier1, supplier2, trader1, trader2, account1 };
  }

  async function approvedSupplies() {
    const { dexPool, weth, usdc, supplier1, supplier2} = await loadFixture(deployDexPool);
    const wethAmount = utils.parseEther(FIFTY);
    const usdcAmount = utils.parseUnits(ONEHUNDRED, 6);
    
    await weth.connect(supplier1).approve(dexPool.address, wethAmount);
    await usdc.connect(supplier1).approve(dexPool.address, usdcAmount);

    await weth.connect(supplier2).approve(dexPool.address, wethAmount);
    await usdc.connect(supplier2).approve(dexPool.address, usdcAmount);

    return { wethAmount, usdcAmount};
  }

  async function addLiquidity() {
    const { dexPool, weth, owner, usdc, supplier1, supplier2} = await loadFixture(deployDexPool);
    const { wethAmount, usdcAmount } = await loadFixture(approvedSupplies);

    await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
    await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount);
    await dexPool.connect(supplier1).addLiquidity(supplier1.address);

    await expect(weth.connect(supplier2).transfer(dexPool.address, wethAmount))
      .not.to.be.reverted;
    await expect(usdc.connect(supplier2).transfer(dexPool.address, usdcAmount))
      .not.to.be.reverted;

    await expect(dexPool.connect(supplier2).addLiquidity(supplier2.address))
      .not.to.be.reverted;
  
    const [reserve0, reserve1, ] = await dexPool.getLatestReserves();
    return { reserve0, reserve1, wethAmount, usdcAmount };
  }

  describe("Contract deployment", () => {

    it("Should validate the number of usdc decimals", async () => {
      const { dexPool, weth, usdc, owner} = await loadFixture(deployDexPool);

      expect(await usdc.decimals()).to.be.equal(decimals);
    });

    it("Should set the right owner", async () => {
      const { dexPool, owner} = await loadFixture(deployDexPool);
      expect(await dexPool.owner()).to.equal(owner.address);
    });

    it("Should be initialized after deployment", async () => {
      const { dexPool, weth, usdc, owner} = await loadFixture(deployDexPool);
      
      await expect(dexPool.initialize(weth.address, usdc.address, fees))
          .to.be.revertedWith("initialization not allowed!");
    });
    
    it("Should be initilized by contract owner", async () => {
      const [,notOwner] = await ethers.getSigners();
      const WETH = await ethers.getContractFactory("WETH9");
      const weth = await WETH.deploy();
      await weth.deployed();

      const USDC = await ethers.getContractFactory("USDC");
      const usdc = await USDC.deploy();
      await usdc.deployed();

      const DexPool = await ethers.getContractFactory("DexPool");
      const dexPool = await DexPool.deploy();
      await dexPool.deployed();

      await expect(dexPool.connect(notOwner).initialize(weth.address, usdc.address, fees))
          .to.be.revertedWith("Ownable: caller is not the owner");
    });
    
    it("Should not be initilized with zero addresses", async () => {
      const [,notOwner] = await ethers.getSigners();
      const WETH = await ethers.getContractFactory("WETH9");
      const weth = await WETH.deploy();
      await weth.deployed();

      const USDC = await ethers.getContractFactory("USDC");
      const usdc = await USDC.deploy();
      await usdc.deployed();

      const DexPool = await ethers.getContractFactory("DexPool");
      const dexPool = await DexPool.deploy();
      await dexPool.deployed();

      await expect(dexPool.initialize(ZeroAddress, usdc.address, fees))
          .to.be.revertedWith("zero address not allowed!");

      await expect(dexPool.initialize(weth.address, ZeroAddress, fees))
          .to.be.revertedWith("zero address not allowed!");
    });
    
    it("Should validate info related to the tokens", async  () => {
      const { dexPool} = await loadFixture(deployDexPool);

      const token0 = await dexPool.token0();
      const token1 = await dexPool.token1();

      const _weth = await ethers.getContractAt(
        "WETH9", 
        token0
      );

      const _usdc = await ethers.getContractAt(
        "USDC", 
        token1
      );

      expect(await _weth.name()).to.equal("Wrapped Ether");
      expect(await _weth.symbol()).to.equal("WETH");

      expect(await _usdc.name()).to.equal("My USDC");
      expect(await _usdc.symbol()).to.equal("USDC");

      const _wethTotalSupply = await _weth.totalSupply();
      
      expect(
        BigNumber.from(_wethTotalSupply)
      ).to.equal(initialTokens.mul(4));

      const _usdcTotalSupply = await _usdc.totalSupply();
       expect(
        BigNumber.from(_usdcTotalSupply)
      ).to.equal(utils.parseEther(ONEMILLION));
    });
    
    it("Should set liquidity pool fees", async () => {
      const { dexPool} = await loadFixture(deployDexPool);
      expect(await dexPool.fees()).to.equal(fees);
    });
  });

  describe("Validating fee value", () => {
      it("Should be able to change swapping fees", async () => {
        const { dexPool} = await loadFixture(deployDexPool);
        const newFees = ZERO;

        await dexPool.setLiquidityPoolFees(newFees);
        expect(await dexPool.fees()).to.equal(newFees);
      });

      it("Should not be able to change swapping fees if not owner", async () => {
        const { dexPool, account1} = await loadFixture(deployDexPool);
        const newFees = 4;

        await expect(dexPool.connect(account1).setLiquidityPoolFees(newFees))
          .to.be.revertedWith("Ownable: caller is not the owner");
      });
      
      it("Should be a different new fee value", async () => {
        const { dexPool, account1} = await loadFixture(deployDexPool);
        const newFees = fees;

        await expect(dexPool.setLiquidityPoolFees(newFees))
          .to.be.revertedWith("fees should be different!");
      });
  }); 
  
  describe("Add liquidity", async () => {
        it("Should provide enough allowance to the AMM", async () => {
          const { dexPool, supplier1, weth, usdc} = await loadFixture(deployDexPool);
          const { } = await loadFixture(approvedSupplies);

          const value0 = utils.parseEther(FIFTY);
          const value1 = utils.parseEther(ONEHUNDRED); 

          await weth.connect(supplier1).transfer(dexPool.address, value0);
          await usdc.connect(supplier1).transfer(dexPool.address, value1);

          await expect(dexPool.connect(supplier1).addLiquidity(supplier1.address))
            .not.to.be.reverted;

          await expect(dexPool.connect(supplier1).addLiquidity(supplier1.address))
            .to.be.revertedWith("Liquidity amount should not be zero!");
        });

        
       it("Should transfer tokens before adding liquidity", async () => {
          const { dexPool, weth, usdc, supplier1} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await expect(dexPool.connect(supplier1).addLiquidity(supplier1.address))
            .to.be.revertedWith("Liquidity amount should not be zero!");

          await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount);

          await expect(dexPool.connect(supplier1).addLiquidity(supplier1.address))
            .not.to.be.reverted;
        });
        
        it("Should faild if only transfer tokens to reserve0 before adding liquidity", async () => {
          const { dexPool, weth, usdc, supplier1} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
          
          await expect(dexPool.connect(supplier1).addLiquidity(supplier1.address))
            .to.be.revertedWith("Liquidity amount should not be zero!");
        });
        
        it("Should faild if only transfer tokens to reserve1 before adding liquidity", async () => {
          const { dexPool, weth, usdc, supplier1} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount);

          await expect(dexPool.connect(supplier1).addLiquidity( supplier1.address))
            .to.be.revertedWith("Liquidity amount should not be zero!");
        });
       
       it("Should validate reserves", async () => {
          const { dexPool, weth, usdc, supplier1} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount);

          await dexPool.connect(supplier1).addLiquidity(supplier1.address);

          const [reserve0, reserve1, ] = await dexPool.getLatestReserves();
          
          expect(reserve0).to.be.equal(wethAmount);
          expect(reserve1).to.be.equal(usdcAmount);
        });
        
        it("Should validate reserves after multiples liquidity supplies", async () => {
          const { dexPool, supplier1, supplier2, weth, usdc} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount);
          await dexPool.connect(supplier1).addLiquidity(supplier1.address);
          
          await weth.connect(supplier2).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier2).transfer(dexPool.address, usdcAmount);
          await dexPool.connect(supplier2).addLiquidity(supplier2.address);
          
          const [reserve0, reserve1, ] = await dexPool.getLatestReserves();
          
          expect(reserve0).to.be.equal(wethAmount.mul(2));
          expect(reserve1).to.be.equal(usdcAmount.mul(2));
        });
        
        it("Should validate shares after multiples liquidity supplies", async () => {
          const { dexPool, weth, usdc, supplier1, supplier2} = await loadFixture(deployDexPool);
          const { wethAmount, usdcAmount} = await loadFixture(approvedSupplies);

          await weth.connect(supplier1).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier1).transfer(dexPool.address, usdcAmount)
          await dexPool.connect(supplier1).addLiquidity(supplier1.address);

          await weth.connect(supplier2).transfer(dexPool.address, wethAmount);
          await usdc.connect(supplier2).transfer(dexPool.address, usdcAmount);
          await dexPool.connect(supplier2).addLiquidity(supplier2.address);
          
          const [reserve0, reserve1, ] = await dexPool.getLatestReserves();

          const totalSupply = await dexPool.totalSupply();

          const x = wethAmount.mul(totalSupply).div(reserve0);
          const y = usdcAmount.mul(totalSupply).div(reserve1);
          
          const shares = bn.min(new bn(x.toString()), new bn(y.toString()));

          expect(shares).to.equal(usdcAmount.mul(totalSupply).div(reserve1));
          const supplierBalanceOf = await dexPool.balanceOf(supplier2.address);

          expect(shares).to.be.equal(supplierBalanceOf);
        });
    }); 
    
    describe("Swap with without fees", async () => {
       it("Should validate the amount of tokens out with zero fees", async () => {
          const { dexPool, weth} = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);
          const amountIn = FIVE;
         
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const _tokensOut = reserve1.mul(amountIn).div(reserve0.add(amountIn));
          const tokensOut = await dexPool.getTokensOutAmount(weth.address, amountIn);
                    
          expect(tokensOut).to.be.equal(_tokensOut);
        });
        
        it("Should accept zero to pre-calculate the tokensOut, no fees", async () => {
          const { dexPool, weth} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const amountIn = utils.parseEther(ZERO.toString());

          await expect(dexPool.getTokensOutAmount(weth.address, amountIn))
            .not.to.be.reverted;
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await dexPool.getTokensOutAmount(weth.address, amountIn);
          
          expect(tokensOut).to.be.equal(ZERO);
        });
        
        it("Should validate only address in pool", async () => {
          const { dexPool, account1} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await expect(dexPool.getTokensOutAmount(account1.address, FIVE))
          .to.be.revertedWith("token is not supported!");
        });
        
        it("Should be able to swap, no fees", async () => {
          const { dexPool, usdc, weth, trader1} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const usdcInitialBalance = await usdc.balanceOf(trader1.address);
          const wethInitialBalance = await weth.balanceOf(trader1.address);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);
                   
          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, weth.address))
            .not.to.be.reverted;

          const usdcNewBalance = (await usdc.balanceOf(trader1.address));
          const wethNewBalance = (await weth.balanceOf(trader1.address));

          const [_reserve0, _reserve1, ] = await dexPool.getLatestReserves();
          
          expect(wethNewBalance).to.be.equal(wethInitialBalance.sub(FIVE));
          expect(tokensOut).to.be.equal(usdcNewBalance.sub(usdcInitialBalance));
        });
        
        it("Should verify reserves after swaping", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);
                   
          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, weth.address))
            .not.to.be.reverted;

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0.add(FIVE));
          expect(_reserve1_After).to.be.equal(reserve1.sub(tokensOut));
        });
        
        it("Should validate amountOut greater than zero", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          await expect(dexPool.connect(trader1).swap(0, trader1.address, weth.address))
            .to.be.revertedWith("amountOut should be greater than zero!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        }); 
        
        it("Should validate enough reserves", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          await expect(dexPool.connect(trader1).swap(
                reserve1.add(1), trader1.address, weth.address)
          ).to.be.revertedWith("not enough reserveOut!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        }); 
        
        it("Should prevent swap without amountIn", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, weth.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });
        
        it("Should prevent swap without enough amountIn", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);
          
          await weth.connect(trader1).transfer(dexPool.address, ONE_ETHER.mul(4));

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, weth.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });
        
        it("Should validate tokensOut in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          const _tokensOut = reserve0.mul(TEN).div(reserve1.add(TEN));

          expect(tokensOut).to.be.equal(_tokensOut);
        });
        
        it("Should validate trader balance in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);
          const traderDaiInitial = (await usdc.balanceOf(trader1.address));
          const traderWethInitialBalance = (await weth.balanceOf(trader1.address));

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          expect(await dexPool.connect(trader1).swap(tokensOut, trader1.address, usdc.address))
            .not.to.be.reverted;

          const traderDaiNewBalance = (await usdc.balanceOf(trader1.address));
          const traderWethNewBalance = (await weth.balanceOf(trader1.address));

          expect(traderDaiNewBalance).to.be.equal(traderDaiInitial.sub(TEN));
          expect(traderWethNewBalance).to.be.equal(traderWethInitialBalance.add(tokensOut));

        });
        
        it("Should validate reserves after swaping in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);
          
          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, usdc.address))
            .not.to.be.reverted;

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();

          expect(reserve0).to.be.equal(_reserve0_After.add(tokensOut));
          expect(reserve1).to.be.equal(_reserve1_After.sub(TEN));
        });

        it("Should validate enough reserves when swaping in opposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          await expect(dexPool.connect(trader1).swap(
                reserve0.add(1), trader1.address, usdc.address)
          ).to.be.revertedWith("not enough reserveOut!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });

        it("Should prevent swap in opposite direction without amountIn", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, usdc.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });

        it("Should prevent swap in opposite direction without enough amountIn", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TENUSDC);

          // there is a precission issue here...
          await usdc.connect(trader1).transfer(dexPool.address, TENUSDC.sub(1));

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, usdc.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });

    });

    describe("Swap with with fees", async () => {
        it("Should validate the amount of tokens out with fees", async () => {
          const { dexPool, weth} = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const amountIn = FIVE;
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const amountInWithFees = FIVE.mul(factor - fees).div(factor);
          const tokensOut = await dexPool.getTokensOutAmount(weth.address, amountIn);
          const _tokensOut = reserve1.mul(amountInWithFees).div(reserve0.add(amountInWithFees));
          
          expect(tokensOut).to.be.equal(_tokensOut);
        });
        
        it("Should accept zero to pre-calculate the tokensOut, with fees", async () => {
          const { dexPool, weth} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          await expect(dexPool.getTokensOutAmount(weth.address, ZERO))
            .not.to.be.reverted;
          
          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          const tokensOut = await dexPool.getTokensOutAmount(weth.address, ZERO);
          
          expect(tokensOut).to.be.equal(ZERO);
        });
        
        it("Should validate only address in pool", async () => {
          const { dexPool, account1} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await expect(dexPool.getTokensOutAmount(account1.address, FIVE))
          .to.be.revertedWith("token is not supported!");
        });

        it("Should be able to swap, with fees", async () => {
          const { dexPool, usdc, weth, trader1} = await loadFixture(deployDexPool);
          const { reserve0, reserve1, wethAmount, usdcAmount } = await loadFixture(addLiquidity);

          const usdcInitialBalance = await usdc.balanceOf(trader1.address);
          const wethInitialBalance = await weth.balanceOf(trader1.address);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);
                   
          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, weth.address))
            .not.to.be.reverted;

          const usdcNewBalance = (await usdc.balanceOf(trader1.address));
          const wethNewBalance = (await weth.balanceOf(trader1.address));

          const [_reserve0, _reserve1, ] = await dexPool.getLatestReserves();
          
          expect(wethNewBalance).to.be.equal(wethInitialBalance.sub(FIVE));
          expect(tokensOut).to.be.equal(usdcNewBalance.sub(usdcInitialBalance));
        });

        it("Should verify reserves after swaping", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);
                   
          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, weth.address))
            .not.to.be.reverted;

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0.add(FIVE));
          expect(_reserve1_After).to.be.equal(reserve1.sub(tokensOut));
        });

        it("Should validate amountOut greater than zero", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          // tokenOut = ( reserves1 * tokenIn) / (reserves0 + tokensIn)
          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          await expect(dexPool.connect(trader1).swap(0, trader1.address, weth.address))
            .to.be.revertedWith("amountOut should be greater than zero!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        }); 
        
        it("Should validate enough reserves", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await dexPool.setLiquidityPoolFees(ZERO);

          await weth.connect(trader1).transfer(dexPool.address, FIVE);

          await expect(dexPool.connect(trader1).swap(
                reserve1.add(1), trader1.address, weth.address)
          ).to.be.revertedWith("not enough reserveOut!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        }); 
        
        it("Should prevent swap without amountIn", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, weth.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });
        
        it("Should prevent swap without enough amountIn", async () => {
          const { dexPool, weth, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const tokensOut = await dexPool.getTokensOutAmount(weth.address, FIVE);

          await weth.connect(trader1).transfer(dexPool.address, ONE_ETHER.mul(4));

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, weth.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });
        
        it("Should validate tokensOut in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          const amountInWithFees = TEN.mul(factor - fees).div(factor);

          const _tokensOut = reserve0.mul(amountInWithFees).div(reserve1.add(amountInWithFees));

          expect(tokensOut).to.be.equal(_tokensOut);
        });
        
        it("Should validate trader balance in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const traderDaiInitial = (await usdc.balanceOf(trader1.address));
          const traderWethInitialBalance = (await weth.balanceOf(trader1.address));

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          expect(await dexPool.connect(trader1).swap(tokensOut, trader1.address, usdc.address))
            .not.to.be.reverted;

          const traderDaiNewBalance = (await usdc.balanceOf(trader1.address));
          const traderWethNewBalance = (await weth.balanceOf(trader1.address));

          expect(traderDaiNewBalance).to.be.equal(traderDaiInitial.sub(TEN));
          expect(traderWethNewBalance).to.be.equal(traderWethInitialBalance.add(tokensOut));

        });
        
        it("Should validate reserves after swaping in the oposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);
         
          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          await expect(dexPool.connect(trader1).swap(tokensOut, trader1.address, usdc.address))
            .not.to.be.reverted;

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();

          expect(reserve0).to.be.equal(_reserve0_After.add(tokensOut));
          expect(reserve1).to.be.equal(_reserve1_After.sub(TEN));
        });

        it("Should validate enough reserves when swaping in opposite direction", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          await usdc.connect(trader1).transfer(dexPool.address, TEN);

          await expect(dexPool.connect(trader1).swap(
                reserve0.add(1), trader1.address, usdc.address)
          ).to.be.revertedWith("not enough reserveOut!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });

        it("Should prevent swap in opposite direction without amountIn", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, usdc.address)
          ).to.be.revertedWith("swap failed!");

          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });

        it("Should prevent swap in opposite direction without enough amountIn", async () => {
          const { dexPool, weth, usdc, trader1 } = await loadFixture(deployDexPool);
          const { reserve0, reserve1 } = await loadFixture(addLiquidity);

          const tokensOut = await dexPool.getTokensOutAmount(usdc.address, TEN);

          // there is a precission issue here...
          await usdc.connect(trader1).transfer(dexPool.address, ONE_ETHER.mul(9));

          await expect(dexPool.connect(trader1).swap(
                tokensOut, trader1.address, usdc.address)
          ).to.be.revertedWith("swap failed!");
          
          const [_reserve0_After, _reserve1_After, ] = await dexPool.getLatestReserves();
          
          expect(_reserve0_After).to.be.equal(reserve0);
          expect(_reserve1_After).to.be.equal(reserve1);
        });
    });
});

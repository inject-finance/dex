import { loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, utils} from 'ethers';
import { expect } from "chai";
import { ethers, network } from "hardhat";
import bn  from 'bignumber.js';


const initialTokens = utils.parseEther("1000");
const fees = 30; //.3%
const ZERO = 0;
const ONE = 1;
const FIVE = "5";
const FIFTY = "50";
const ONEHUNDRED = "100";
const ONEMILLION = "1000000";
const TEN = "10";
const factor = 10000;
const ZeroAddress = ethers.constants.AddressZero;

describe("Pool Factory Test", () => {
    async function deployPoolFactory() {
    // Contracts are deployed using the first signer/account by default
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
  
    await weth.connect(supplier1).deposit({value: initialTokens});
    await weth.connect(supplier2).deposit({value: initialTokens});
    await weth.connect(trader1).deposit({value: initialTokens});
    await weth.connect(trader2).deposit({value: initialTokens});

    await dai.transfer(supplier1.address, initialTokens);
    await dai.transfer(supplier2.address, initialTokens);
    await dai.transfer(trader1.address, initialTokens);
    await dai.transfer(trader2.address, initialTokens);

    return { poolFactory,  weth, dai, owner, supplier1, supplier2, trader1, trader2, account1 };
  }

  describe("Contract deployment",  () => {

    it("Should set the right owner", async () => {
        const { poolFactory, owner} = await loadFixture(deployPoolFactory);
        // Create a pool with the tokens WETH and DAI
        const _owner = await poolFactory.owner();
        expect(_owner).to.be.equal(owner.address);
    });

    it("Should allow to create a pair", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        expect(await poolFactory.allPairsLength()).to.be.equal(ZERO);

        expect(await poolFactory.pairExists(weth.address, dai.address)).to.be.equal(false);

        // Create a pool with the tokens WETH and DAI
        await poolFactory.createPair(weth.address, dai.address, fees);

        expect(await poolFactory.allPairsLength()).to.be.equal(ONE);

        // Verify that the pair was created
        expect(await poolFactory.pairExists(weth.address, dai.address)).to.be.equal(true);

        expect(await poolFactory.pairExists(dai.address, weth.address)).to.be.equal(true);
    });

    it("Should initialize the dex pool", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        // Create a pool with the tokens WETH and DAI
        await expect(poolFactory.createPair(weth.address, dai.address, fees))
          .not.to.be.reverted;

        const pairAddress = await poolFactory.getPairAddress(weth.address, dai.address);

        const dexPool = await ethers.getContractAt("DexPool", pairAddress);
        expect(await dexPool.initialized()).to.be.equal(true);
        expect(await dexPool.owner()).to.be.equal(owner.address);
    });

    it("Should not be able to call the initialize function", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        await poolFactory.createPair(weth.address, dai.address, fees);

        const poolAddress = await poolFactory.getPairAddress(weth.address, dai.address);

        const dexPool = await ethers.getContractAt("DexPool", poolAddress);

        expect(await dexPool.initialized()).to.be.equal(true);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [poolFactory.address],
        });

        await network.provider.send("hardhat_setBalance", [
            poolFactory.address,
            "0x1000000000000000",
        ]);

        const signer = await ethers.getSigner(poolFactory.address);

        await expect(dexPool.connect(signer).initialize(weth.address, dai.address, fees))
          .to.be.revertedWith("Ownable: caller is not the owner");

        await expect(dexPool.connect(owner).initialize(weth.address, dai.address, fees))
          .to.be.revertedWith("initialization not allowed!");
    });

    it("Should validate a pair address", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        const initialAddress = await poolFactory.getPairAddress(weth.address, dai.address);
        expect(initialAddress).to.be.equal(ZeroAddress);

        expect(await poolFactory.pairExists(weth.address, dai.address)).to.be.equal(false);

        // Create a pool with the tokens WETH and DAI
        await expect(poolFactory.createPair(weth.address, dai.address, fees))
            .not.to.be.reverted;

        const poolAddress = await poolFactory.getPairAddress(weth.address, dai.address);
        const dexPool = await ethers.getContractAt("DexPool", poolAddress);

        const _token0 = await dexPool.token0();
        const _token1 = await dexPool.token1();
      
        expect(_token0).to.be.equal(weth.address);
        expect(_token1).to.be.equal(dai.address);        
    });

    it("Should validate pool creation on both ways", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        // Create a pool with the tokens WETH and DAI
        await poolFactory.createPair(weth.address, dai.address, fees);

        const poolAddressRight = await poolFactory.getPairAddress(weth.address, dai.address);
        const poolAddressLeft = await poolFactory.getPairAddress(dai.address, weth.address);
        
        expect(poolAddressRight).to.be.equal(poolAddressLeft);
    });

    it("Should validate if token addresses are the same!", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        // Create a pool with the tokens WETH and DAI
        await expect(poolFactory.createPair(weth.address, weth.address, fees))
          .to.be.revertedWith("identical addresses not allowed!");

        await expect(poolFactory.createPair(dai.address, dai.address, fees))
          .to.be.revertedWith("identical addresses not allowed!");
    });

    it("Should validate address equal to zero", async () => {
        const { poolFactory, owner, weth, dai } = await loadFixture(deployPoolFactory);

        await expect(poolFactory.createPair(ZeroAddress, dai.address, fees))
          .to.be.revertedWith("zero address is not allowed!");

        await expect(poolFactory.createPair(weth.address, ZeroAddress, fees))
          .to.be.revertedWith("zero address is not allowed!");
    });

    it("Should validate a pair already created", async () => {
        const { poolFactory, owner, weth, dai} = await loadFixture(deployPoolFactory);

        await expect(poolFactory.createPair(weth.address, dai.address, fees))
            .not.to.be.reverted;

        await expect(poolFactory.createPair(weth.address, dai.address, fees))
          .to.be.rejectedWith("token pair exists!");

        await expect(poolFactory.createPair(dai.address, weth.address, fees))
          .to.be.rejectedWith("token pair exists!");
    });

    it("Should not allow anyone to create a new token pool", async () => {
        const { poolFactory, supplier1, weth, dai} = await loadFixture(deployPoolFactory);
        
        await expect(poolFactory.connect(supplier1).createPair(weth.address, dai.address, fees))
            .to.be.revertedWith("not authorized!");
    });

    it("Should be able to whitelist users", async () => {
        const { poolFactory, supplier1, supplier2, weth, dai} = await loadFixture(deployPoolFactory);
        await poolFactory.addToWhitelist([supplier1.address, supplier2.address]);

        await expect(poolFactory.connect(supplier2).createPair(weth.address, dai.address, fees))
            .not.to.be.reverted;
    });

    it("Should be able to remove whitelisted users", async () => {
        const { poolFactory, supplier1, supplier2, weth, dai} = await loadFixture(deployPoolFactory);
        await poolFactory.addToWhitelist([supplier1.address, supplier2.address]);

        await expect(poolFactory.connect(supplier2).createPair(weth.address, dai.address, fees))
            .not.to.be.reverted;

        await poolFactory.removeFromWhitelist([supplier2.address]);

        await expect(poolFactory.connect(supplier2).createPair(dai.address, weth.address, fees))
            .to.be.revertedWith("not authorized!");
    });

    it("Should emit an event", async () => {
        const { poolFactory, supplier1, weth, dai} = await loadFixture(deployPoolFactory);

        await poolFactory.addToWhitelist([supplier1.address]);

        await expect( poolFactory.connect(supplier1).createPair(weth.address, dai.address, fees))
          .to.emit(poolFactory, "LogCreatePair")
            .withArgs(
              weth.address, dai.address, supplier1.address, ONE
            );
    });

    it("Should not be able to create a pool if paused", async () => {
        const { poolFactory, supplier1, weth, dai} = await loadFixture(deployPoolFactory);
        await poolFactory.pause();

        await expect( poolFactory.createPair(dai.address, weth.address, fees))
          .to.be.rejectedWith("Pausable: paused");

        await poolFactory.unpause();

        await expect( poolFactory.createPair(dai.address, weth.address, fees))
          .not.to.be.rejected;
    });

    it("Should be paused only by the contract owner", async () => {
        const { poolFactory, supplier1, weth, dai} = await loadFixture(deployPoolFactory);

        await expect( poolFactory.connect(supplier1).pause())
          .to.be.rejectedWith("Ownable: caller is not the owner")
    });
  });

});

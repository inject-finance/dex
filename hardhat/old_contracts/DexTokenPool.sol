// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IPoolFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract DexTokenPool is Ownable, Pausable, ReentrancyGuard{
    using SafeERC20 for IERC20;

    IERC20 public token0;
    IERC20 public token1;

    uint public constant MAX_FEE_PERCENT = 300; // 3%
    uint private reserve0;
    uint private reserve1;
    uint public totalSupply;
    uint public fees;
    uint private factor = 10000;

    address public factory;
    bool public initialized;

    uint private blockTimestampLast;

    mapping(address => uint) public balanceOf;

    event LogSetNewFees(uint _newFees, address _sender);

    event LogAddLiquidity(
        uint _amount0, 
        uint _amount1, 
        uint _shares, 
        address _sender, 
        uint _reserve0,
        uint _reserve1
    );

    event LogSwapTokens(
        address _trader, 
        uint fees,
        address _tokenIn, 
        address _tokenOut, 
        uint amountOut,
        uint _newReserve0,
        uint _newReserve1
    );

    event LogGetIncorrectTokenDeposit(address _token, address _receiver);

    modifier onlyTokenInPool(address _tokenIn) {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "token is not supported!"
        );
        _;
    }

    constructor() {}

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1, uint _fees) 
        external
        onlyOwner
    {
        require(!initialized, 'initialization not allowed!');
        require(_token0 != address(0) && _token1 != address(0), "zero address not allowed!");
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
        factory = msg.sender;

        fees = _fees;
        initialized = true;
    }

    function getActualReserves() 
        public 
        view 
        returns (uint _reserve0, uint _reserve1, uint _blockTimestampLast) 
    {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function setLiquidityPoolFees(uint _newFees)
        external 
        onlyOwner
    {
        require(_newFees != fees, "fees should be different!");
        require(_newFees <=  MAX_FEE_PERCENT, "fees exceed limit!");
        fees = _newFees;
        emit LogSetNewFees(_newFees, msg.sender);
    }

    // Verify these two functions:
    function _mint(address _to, uint _amount)
        private 
    {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) 
        private 
    {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }
    /******************************************/

    function _updateReserves(uint _reserve0, uint _reserve1) 
        private
    {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
        blockTimestampLast = block.timestamp;
    }

    function swap(uint _amountOut, address _to, address _tokenIn)
        whenNotPaused
        nonReentrant
        external
    {
        
        require(_amountOut > 0, "amountOut should be greater than zero!");
        
        (IERC20 tokenIn, IERC20 tokenOut, uint reserveIn, uint reserveOut) = getReserves(_tokenIn);
        
        require(_amountOut < reserveOut, "not enough reserveOut!");
        
        // Transfer token out to msg.sender
        IERC20(tokenOut).safeTransfer(_to, _amountOut);
        
        uint balanceIn = tokenIn.balanceOf(address(this));
        uint balanceOut = tokenOut.balanceOf(address(this));
        
        ( uint newReserve0, uint newReserve1 ) = 
            _tokenIn == address(token0) ? (balanceIn, balanceOut) : (balanceOut, balanceIn);
        
        // Fees are invested again in the pool!
        require(newReserve0 * newReserve1 >= reserveIn * reserveOut, "swap failed!");
        
        // Update the reserves
        _updateReserves(newReserve0, newReserve1);
        emit LogSwapTokens(
            msg.sender, fees, address(tokenIn), address(tokenOut), _amountOut, newReserve0 , newReserve1
        );
    }

    function getReserves(address _tokenIn) 
        public
        view
        returns (IERC20 tokenIn, IERC20 tokenOut, uint reserveIn, uint reserveOut) 
    {
        bool isToken0 = _tokenIn == address(token0);
        (   
            tokenIn, tokenOut, reserveIn,  reserveOut
        ) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);
    }

    function getTokensOutAmount(address _tokenIn, uint _amountIn)
        public
        view
        onlyTokenInPool(_tokenIn)
        returns (uint amountOut)
    {       
        (,, uint reserveIn, uint reserveOut) = getReserves(_tokenIn);
        uint amountInWithFee = (_amountIn * (factor-fees)) / factor;
        amountOut = (reserveOut * amountInWithFee)/ (reserveIn + amountInWithFee);
    }

    function getTokenPairRatio(address _tokenIn, uint _amount)
        external
        view
        onlyTokenInPool(_tokenIn)
        returns (uint tokenOut)
    {

        (,, uint reserveIn, uint reserveOut) = getReserves(_tokenIn);

        tokenOut = (reserveOut * _amount) / reserveIn;
    }

    function addLiquidity(uint _amount0, uint _amount1)
        external
        whenNotPaused
        returns (uint shares)
    {
        // Pull in token0 and token1
        // Verify This, if necessary or fails because is a contract. 
        token0.safeTransferFrom(msg.sender, address(this), _amount0);
        token1.safeTransferFrom(msg.sender, address(this), _amount1);

        // dy / dx = y / x
        // Verify condition
        if(reserve0 > 0 || reserve1 > 0) {
            require(reserve0 * _amount1 == reserve1 * _amount0,
            "unbalanced reserves!"
            );
        }

        // Mint shares
        // f( x, y ) = value of liquidity = sqrt(xy)
        // s = dx / x * T = dy / y * T
        if(totalSupply == 0) {
            shares = Math.sqrt(_amount0 * _amount1);
        }
        else {
            shares = Math.min(
                (_amount0 * totalSupply) / reserve0, 
                (_amount1 * totalSupply) / reserve1
            );
        }

        require(shares > 0, "shares equals 0");
        _mint(msg.sender, shares);

        // Update reserves
        _updateReserves(
            token0.balanceOf(address(this)),
            token1.balanceOf(address(this))
        );

        emit LogAddLiquidity(_amount0, _amount1, shares, msg.sender, reserve0, reserve1);
    }

    function removeLiquidity(uint _shares)
        external
        nonReentrant
        returns (uint amount0, uint amount1)
    {
        uint balance0 = token0.balanceOf(address(this));
        uint balance1 = token1.balanceOf(address(this));

        amount0 = (_shares * balance0) / totalSupply;
        amount1 = (_shares * balance1) / totalSupply;
        require(amount0 > 0 && amount1 > 0, "amount0 or amount1 = 0");

        _burn(msg.sender, _shares);
        _updateReserves(balance0 - amount0, balance1 - amount1);

        token0.safeTransfer(msg.sender, amount0);
        token1.safeTransfer(msg.sender, amount1);
    }

    function getIncorrectTokenDeposit(IERC20 _token, address _receiver)
        external
        nonReentrant
    {
        require(msg.sender == IPoolFactory(factory).owner(), "only factory's owner");
        require(_token != token0 && _token != token1, "invalid token!");

        uint balance = _token.balanceOf(address(this));
        _token.safeTransfer(_receiver, balance);
        
        emit LogGetIncorrectTokenDeposit(address(_token), _receiver);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
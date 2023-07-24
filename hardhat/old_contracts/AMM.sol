// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract AMM is Ownable, Pausable{
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    uint public reserve0;
    uint public reserve1;

    uint public totalSupply;
    uint public fees;
    uint private factor = 1000;

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
        uint _amountIn, 
        address _tokenOut, 
        uint amountOut,
        uint _newReserve0,
        uint _newReserve1
    );

    constructor(address _token0, address _token1, uint _fees) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
        fees = _fees;
    }

    function setLiquidityPoolFees(uint _newFees) 
        onlyOwner 
        external 
    {
        require(_newFees != fees, "fees should be different!");
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
    }

    function swap(address _tokenIn, uint _amountIn)
        whenNotPaused()
        external
        returns (uint amountOut)
    {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "token is not supported!"
        );
        require(_amountIn > 0, "amount in should be greater than zero");

        // Pull in token in
        bool isToken0 = _tokenIn == address(token0);

        (   
            IERC20 tokenIn, IERC20 tokenOut,
            uint reserveIn, uint reserveOut
        ) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);
        // Calculate token out (include fees), default should be: 0.3%
        // ydx / (x + dx) = dy
        uint amountInWithFee = (_amountIn * (factor - fees)) / factor;
        amountOut = reserveOut * amountInWithFee / (reserveIn + amountInWithFee);

        require( reserveOut >  amountOut, "reserve out is not enough!");

        // Transfer token out to msg.sender
        require(tokenOut.transfer(msg.sender, amountOut), "transfer failed!");

        uint newReserve0 = token0.balanceOf(address(this));
        uint newReserve1 = token1.balanceOf(address(this));

        // Update the reserves
        _updateReserves(newReserve0, newReserve1);

        emit LogSwapTokens(
            msg.sender, fees, address(tokenIn), _amountIn, 
            address(tokenOut), amountOut, newReserve0 , newReserve1
        );
    }

    function getTokensOutAmount(address _tokenIn, uint _amountIn)
        external
        view
        returns (uint amountOut)
    {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "token is not in the pool!"
        );
        
        // Pull in token in
        bool isToken0 = _tokenIn == address(token0);
        (   
            uint reserveIn, uint reserveOut
        ) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        // Calculate token out (include fees), fee 0.3%
        // ydx / (x + dx) = dy
        uint amountInWithFee = (_amountIn * (factor-fees)) / factor;
        amountOut = reserveOut * amountInWithFee / (reserveIn + amountInWithFee);
    }

    function addLiquidity(uint _amount0, uint _amount1) 
        external
        returns (uint shares)
    {
        // Pull in token0 and token1
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);

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
        returns (uint amount0, uint amount1)
    {
        uint bal0 = token0.balanceOf(address(this));
        uint bal1 = token1.balanceOf(address(this));

        amount0 = (_shares * bal0) / totalSupply;
        amount1 = (_shares * bal1) / totalSupply;
        require(amount0 > 0 && amount1 > 0, "amount0 or amount1 = 0");

        _burn(msg.sender, _shares);
        _updateReserves(bal0 - amount0, bal1 - amount1);

        token0.transfer(msg.sender, amount0);
        token1.transfer(msg.sender, amount1);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDexPool {
    /* 
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    
    function owner() external view returns (address);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);
    function createPair(address tokenA, address tokenB) external returns (address pair);
    */
    function fees() external view returns(uint);
    function swap(uint _amountOut, address _to, address _tokenIn) external;
    function addLiquidity(address _to) external returns (uint shares);
    function removeLiquidity(address _to) external returns (uint amount0, uint amount1);
    function getLatestReserves() external view returns (uint _reserve0, uint _reserve1, uint _blockTimestampLast);
    function getReserves(address _tokenIn) external view returns (IERC20 tokenIn, IERC20 tokenOut, uint reserveIn, uint reserveOut);
    function getTokensOutAmount(address _tokenIn, uint _amountIn) external view returns (uint amountOut);
    function getTokenPairRatio(address _tokenIn, uint _amountIn) external view returns (uint tokenOut);
    function transferFrom(address from, address to, uint256 amount ) external returns (bool);

}
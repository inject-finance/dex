// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/security/Pausable.sol";
import './DexPool.sol';
import './OnChainWhitelist.sol';

contract PoolFactory is Pausable, OnChainWhitelist {
    mapping(address => mapping(address => address)) public getPairAddress;
    address[] public allPairs;

    event LogCreatePair(address _token0, address _token1, address _sender, uint _pairsLength);

    constructor() {}

    function allPairsLength() 
        external 
        view 
        returns (uint) 
    {
        return allPairs.length;
    }

    function createPair(address _token0, address _token1, uint _fees)
        external
        whenNotPaused
        returns (address pairAddress) 
    {
        require(whitelist[msg.sender] || msg.sender == owner(), "not authorized!");
        require(_token0 != _token1, "identical addresses not allowed!");
        require(_token0 != address(0) && _token1 != address(0), "zero address is not allowed!");
        require(getPairAddress[_token0][_token1] == address(0), "token pair exists!");
        
        bytes memory bytecode = type(DexPool).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_token0, _token1));
        
        assembly {
            pairAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        
        require(pairAddress != address(0), "contract deployment failed!");

        getPairAddress[_token0][_token1] = pairAddress;
        getPairAddress[_token1][_token0] = pairAddress;

        allPairs.push(pairAddress);

        DexPool(pairAddress).initialize(_token0, _token1, _fees);
        DexPool(pairAddress).transferOwnership(msg.sender);

        emit LogCreatePair(_token0, _token1, msg.sender, allPairs.length);
    }

    function pairExists(address _tokenA, address _tokenB)
        external
        view
        returns (bool _exists)
    {
        _exists = getPairAddress[_tokenA][_tokenB] != address(0);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
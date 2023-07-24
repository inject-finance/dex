// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
    uint public initialSupply = 1000000 ether;
    constructor() ERC20("My USDC", "USDC") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() override public view virtual returns (uint8) {
        return 6;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract InjectToken is ERC20, Ownable, ERC20Burnable {
    uint public maxSupply = 100000000 ether;

    constructor(uint _initialSupply) ERC20("Inject Finance", "INJ3") {
        require(_initialSupply <= maxSupply, "initial supply should be lower!");
        _mint(msg.sender, _initialSupply);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}

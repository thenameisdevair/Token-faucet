// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;


import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERCASSIGN is ERC20, Ownable{

    uint256 public constant MAX_SUPPLY = 10_000_000e18;

    uint256 public constant CLAIM_AMOUNT = 10e18;

    uint256 public  constant COOL_DOWN = 24 hours;

    mapping (address => uint) cooldown;

    constructor() ERC20("TokenName", "SYM") Ownable(msg.sender) {
    }

    function requestToken() external {
        require(block.timestamp >= cooldown[msg.sender] + COOL_DOWN, "Wait for cool-down");
        require((CLAIM_AMOUNT + totalSupply()) < MAX_SUPPLY, "MAX supply reached");

        cooldown[msg.sender] = block.timestamp;

        _mint(msg.sender, CLAIM_AMOUNT);
        
    }


    function mint(address to, uint256 amount) external onlyOwner{
        require((amount + totalSupply()) < MAX_SUPPLY, "MAX supply reached");

        _mint(to, amount); 
    }

    function nextClaimTime(address user) external view returns(uint256) {
        return(cooldown[user] + COOL_DOWN);
    }

}

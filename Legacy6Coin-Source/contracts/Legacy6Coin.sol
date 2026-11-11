// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Legacy6Coin is ERC20, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 1000000 * 10**18;
    mapping(address => string) public witnessNames;
    address[] public witnesses;

    constructor() ERC20("Legacy6Coin", "L6C") Ownable(msg.sender) {
        witnesses.push(msg.sender);
        witnessNames[msg.sender] = "Founder";

        // Mint 660,000 tokens to yourself (Founder)
        _mint(msg.sender, 660000 * 10**18);

        address[] memory initialWitnesses = new address[](6);
        initialWitnesses[0] = 0xA9f38f1F7537bfA77e6A10e5C3203a441211E548;
        initialWitnesses[1] = 0x00839730DB60Ff3769208808A82134c3974a90F5;
        initialWitnesses[2] = 0xF87767e56650d66E254551dc09391f0F83bc51c0;
        initialWitnesses[3] = 0xBa1856c474998DbaC4936AD43633f9846368b9B6;
        initialWitnesses[4] = 0xC445dCe81f57e2E5eBf3e78aDf71F884bb2533A2;
        initialWitnesses[5] = 0x21EC335039Bca45896f75741433FF869d8a1cB8c;

        for (uint256 i = 0; i < initialWitnesses.length; i++) {
            address witness = initialWitnesses[i];
            witnesses.push(witness);
            witnessNames[witness] = string.concat("Witness_", i.toString());
            _mint(witness, 1000 * 10**18);
        }
    }

    function addWitness(address newWitness, string memory name) external onlyOwner {
        witnesses.push(newWitness);
        witnessNames[newWitness] = name;
        _mint(newWitness, 1000 * 10**18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts-v2/token/ERC20/ERC20.sol";

contract Legacy6CoinV2 is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 public constant FOUNDER_ALLOCATION = 660_000 * 10 ** 18;
    uint256 public constant WITNESS_ALLOCATION = 1_000 * 10 ** 18;

    address private _owner;
    address private _pendingOwner;
    uint256 public totalMinted;
    address[] public witnesses;
    mapping(address => bool) public isWitness;

    error UnauthorizedOwner(address account);
    error MaxSupplyExceeded(uint256 totalMinted, uint256 requested, uint256 maxSupply);
    error ZeroWitnessAddress();
    error DuplicateWitness(address witness);

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event FounderAllocated(address indexed founder, uint256 amount);
    event WitnessAllocated(address indexed witness, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert UnauthorizedOwner(msg.sender);
        }
        _;
    }

    constructor() ERC20("Legacy6Coin", "L6C") {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);

        _mintWithinCap(msg.sender, FOUNDER_ALLOCATION);
        emit FounderAllocated(msg.sender, FOUNDER_ALLOCATION);

        _addWitness(0xA9f38f1F7537bfA77e6A10e5C3203a441211E548);
        _addWitness(0x00839730DB60Ff3769208808A82134c3974a90F5);
        _addWitness(0xF87767e56650d66E254551dc09391f0F83bc51c0);
        _addWitness(0xBa1856c474998DbaC4936AD43633f9846368b9B6);
        _addWitness(0xC445dCe81f57e2E5eBf3e78aDf71F884bb2533A2);
        _addWitness(0x21EC335039Bca45896f75741433FF869d8a1cB8c);
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function pendingOwner() external view returns (address) {
        return _pendingOwner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(_owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != _pendingOwner) {
            revert UnauthorizedOwner(msg.sender);
        }

        address oldOwner = _owner;
        _owner = msg.sender;
        _pendingOwner = address(0);
        emit OwnershipTransferred(oldOwner, msg.sender);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mintWithinCap(to, amount);
    }

    function addWitness(address newWitness) external onlyOwner {
        _addWitness(newWitness);
    }

    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    function _addWitness(address newWitness) private {
        if (newWitness == address(0)) {
            revert ZeroWitnessAddress();
        }
        if (isWitness[newWitness]) {
            revert DuplicateWitness(newWitness);
        }

        _mintWithinCap(newWitness, WITNESS_ALLOCATION);
        isWitness[newWitness] = true;
        witnesses.push(newWitness);
        emit WitnessAllocated(newWitness, WITNESS_ALLOCATION);
    }

    function _mintWithinCap(address to, uint256 amount) private {
        if (amount > MAX_SUPPLY - totalMinted) {
            revert MaxSupplyExceeded(totalMinted, amount, MAX_SUPPLY);
        }

        totalMinted += amount;
        _mint(to, amount);
    }
}

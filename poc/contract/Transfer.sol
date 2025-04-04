// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract Transfer {
    function transfer(address to, uint256 amount) public returns (bool) {
        emit TransferSimulated(msg.sender, to, amount);
        return true;
    }
    
    event TransferSimulated(address indexed from, address indexed to, uint256 amount);
}
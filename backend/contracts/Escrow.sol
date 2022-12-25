// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    // * arbiter will be the owner of the contract.
    address public arbiter;
    address public beneficiary;
    address public depositor;
    bool public isApproved;

    event Approved(uint);

    constructor(
        address _depositor,
        address _beneficiary,
        address _arbiter
    ) payable {
        depositor = _depositor;
        beneficiary = _beneficiary;
        arbiter = _arbiter;
    }

    function approve() external {
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }
}

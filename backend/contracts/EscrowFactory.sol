// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Escrow.sol";
import "hardhat/console.sol";

error EscrowFactory__AlreadyApproved(address escrow);
error EscrowFactory__NotAnArbiterOfContract(address caller);

contract EscrowFactory {
    Escrow[] public escrowArray;

    fallback() external payable {}

    receive() external payable {}

    function createNewEscrowContract(
        address _beneficiary,
        address _arbiter
    ) external payable {
        // * create escrow contract.
        Escrow escrow = (new Escrow){value: msg.value}(
            msg.sender,
            _beneficiary,
            _arbiter
        );
        // * push the instance into array.
        escrowArray.push(escrow);
    }

    function approve(uint index) external {
        // * get the contract from the escrow array.
        Escrow escrow = escrowArray[index];
        // * check whether the msg.sender is the arbiter of this contract or not.
        if (escrow.arbiter() != msg.sender) {
            revert EscrowFactory__NotAnArbiterOfContract(msg.sender);
        }
        // * call the approve of escrow contract with this instance.
        // * check weather is it already approved or not.
        if (escrow.isApproved()) {
            revert EscrowFactory__AlreadyApproved(address(escrow));
        }
        escrow.approve();
    }

    function getEscrowContracts() external view returns (Escrow[] memory) {
        return escrowArray;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Escrow.sol";
import "hardhat/console.sol";

error EscrowFactory__AlreadyApproved(address escrow);
error EscrowFactory__NotAnArbiterOfContract(address caller);

/**
 * @title EscrowFactory Smart Contract.
 * @author Ali Murtaza Memon
 * @notice This contract will create new Escrow contract and handle the approval of existing contracts.
 * @custom:portfolio This is a portfolio smart contract.
 */
contract EscrowFactory {
    /**
     * @notice This array will store Escrow contracts.
     */
    Escrow[] public escrowArray;

    /**
     * @notice This will be call incase of calling invalid function that will be not present inside this contract.
     */
    fallback() external payable {}

    /**
     * @notice This will be call incase of calling invalid function with data that will be not present inside this contract.
     */
    receive() external payable {}

    /**
     * @notice This function will take the beneficiary and arbiter addresses and take the msg.value and create the new Escrow contract using that information.
     * @param _beneficiary an address where the funds will be transfered after approval.
     * @param _arbiter an address who will approve the agreement later.
     */
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

    /**
     * @notice This function will be called by arbiter of contract for the approval of agreement between depositer and beneficiary.
     * @param index an index of smart contract store inside the array.
     * @dev users will not be aware of index, it will be handle from frontend side using loops indexes.
     *
     */
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

    /**
     * @notice This function will return the array of Escrow contracts.
     * @return Array of Escrow contracts.
     */
    function getEscrowContracts() external view returns (Escrow[] memory) {
        return escrowArray;
    }
}

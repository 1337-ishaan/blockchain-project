// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title Escrow Smart Contract.
 * @author EscrowFactory Smart Contract.
 * @notice This is the contract that will handle the addresses of beneficiary and arbiter as well as funds that after approval will be transfered to beneficiary.
 * @dev This contract will be created through EscrowFactory Smart Contract.
 */
contract Escrow {
    // * arbiter will be the owner of the contract.

    /**
     * @notice arbiter will be the address that will approve the agreement.
     */
    address public arbiter;
    /**
     * @notice beneficiary will be the address that will receive the funds after approval.
     */
    address public beneficiary;
    /**
     * @notice depositor will be the address that will deposit the funds after approval.
     */
    address public depositor;
    /**
     * @notice This will be the boolean value which will let the caller know about the approval state of this contract.
     */
    bool public isApproved;
    /**
     * @notice This will be the balance that depositer will deposit into this contract for transfer.
     */
    uint256 private balance;

    /**
     * @notice This event will be emitted and contain the balance which will be transfered to beneficiary after approval by the arbiter of this contract.
     */
    event Approved(uint);

    /**
     * @dev This constructor will take the addresses of depositor, beneficiary and arbiter as well as it will take the msg.value which will be deposited to beneficiary address later after approval of arbiter.
     * @param _depositor address.
     * @param _beneficiary address.
     * @param _arbiter address.
     */
    constructor(
        address _depositor,
        address _beneficiary,
        address _arbiter
    ) payable {
        depositor = _depositor;
        beneficiary = _beneficiary;
        arbiter = _arbiter;
        balance = msg.value;
    }

    /**
     * @notice This function will transfer the funds to beneficiary address after approval of arbiter and emit an Approval event.
     */
    function approve() external {
        uint _balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: _balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }

    /**
     * @notice This function will return the balance store in balance variable.
     * @return uint value in wei.
     */
    function getBalance() external view returns (uint) {
        return balance;
    }
}

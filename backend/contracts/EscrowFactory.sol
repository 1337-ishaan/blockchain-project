// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Escrow.sol";
import "hardhat/console.sol";

error EscrowFactory__AlreadyApproved(address escrow);
error EscrowFactory__EscrowContractExistWithThisAddress(address owner);
error EscrowFactory__NoContractFound(address owner);

contract EscrowFactory {
    mapping(address => uint) public ownerToContractIndex;

    Escrow[] public escrowArray;

    modifier isCreated() {
        // * contracts indexes starts from 1 so if mapping returns 0 it means the contract does not exist associate with this address.
        if (ownerToContractIndex[msg.sender] != 0) {
            revert EscrowFactory__EscrowContractExistWithThisAddress(
                msg.sender
            );
        }
        _;
    }

    modifier isExist() {
        // * contracts indexes starts from 1 so if mapping returns 0 it means the contract does not exist associate with this address.
        if (ownerToContractIndex[msg.sender] == 0) {
            revert EscrowFactory__NoContractFound(msg.sender);
        }
        _;
    }

    fallback() external payable {}

    receive() external payable {}

    function createNewEscrowContract(
        address _depositor,
        address _beneficiary
    ) external payable isCreated {
        // * create escrow contract.
        Escrow escrow = (new Escrow){value: msg.value}(
            _depositor,
            _beneficiary,
            msg.sender
        );
        // * push the instance into array.
        escrowArray.push(escrow);
        // * map the index no of contract with arbiter address. Starting from index 1 onward because default value of uint is zero so this will help us later.
        ownerToContractIndex[msg.sender] = escrowArray.length;
    }

    function approve() external isExist {
        // * get the index of contract with arbiter address.
        uint index = ownerToContractIndex[msg.sender];
        // * get the contract from the escrow array.
        Escrow escrow = escrowArray[index - 1];
        // * call the approve of escrow contract with this instance.
        // * check weather is it already approved or not.
        if (escrow.isApproved()) {
            revert EscrowFactory__AlreadyApproved(address(escrow));
        }
        escrow.approve();
    }

    function getEscrowArrayLength() external view returns (uint) {
        return escrowArray.length;
    }

    function isArbiterContractApproved(
        address arbiter
    ) external view returns (bool) {
        // * get the index of contract with arbiter address.
        uint index = ownerToContractIndex[arbiter];
        // * get the contract from the escrow array.
        Escrow escrow = escrowArray[index - 1];

        return escrow.isApproved();
    }
}

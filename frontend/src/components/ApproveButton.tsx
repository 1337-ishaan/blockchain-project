import { useWeb3Contract } from "react-moralis";
import { escrowFactoryAbi, escrowAbi } from "../constants";
import { ethers, ContractTransaction } from "ethers";
import { useNotification } from "@web3uikit/core";
import { AiFillBell } from "react-icons/ai";
import { useState, useEffect } from "react";

interface Props {
    escrowFactoryContractAddress: string;
    escrowAddress: string;
    index: number;
}

function ApproveButton({
    escrowFactoryContractAddress,
    escrowAddress,
    index,
}: Props) {
    const [isApprovedValue, setIsApprovedValue] = useState(false);

    const dispatch = useNotification();

    useEffect(() => {
        (async () => {
            setIsApprovedValue((await isApproved()) as boolean);
        })();
    }, []);

    const { runContractFunction: isApproved } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: escrowAddress,
        functionName: "isApproved",
        params: {},
    });

    const { runContractFunction: approve } = useWeb3Contract({
        abi: escrowFactoryAbi,
        contractAddress: escrowFactoryContractAddress,
        functionName: "approve",
        params: {
            index: index,
        },
    });

    async function onApproveTap() {
        await approve({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => {
                handleError(error);
            },
        });
    }

    async function handleSuccess(tx: ContractTransaction) {
        await tx.wait(1);
        dispatch({
            type: "success",
            title: "Approved",
            message: "Funds transfered to beneficiary address.",
            icon: <AiFillBell />,
            position: "topR",
        });
        setIsApprovedValue(true);
    }

    function handleError(error: Error) {
        if (error.message.includes("EscrowFactory__AlreadyApproved")) {
            dispatch({
                type: "error",
                title: "Error",
                message: "This contract is already approved.",
                icon: <AiFillBell />,
                position: "topR",
            });
        } else if (
            error.message.includes("EscrowFactory__NotAnArbiterOfContract")
        ) {
            dispatch({
                type: "error",
                title: "Error",
                message:
                    "This is not an arbiter address of this contract, only arbiter can approve this agreement.",
                icon: <AiFillBell />,
                position: "topR",
            });
        }
    }

    return isApprovedValue ? (
        <p>It has been approved.</p>
    ) : (
        <button onClick={onApproveTap}>Approve</button>
    );
}

export default ApproveButton;

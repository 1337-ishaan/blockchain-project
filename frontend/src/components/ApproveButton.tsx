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
                console.log(error);
            },
        });
    }

    async function handleSuccess(tx: ContractTransaction) {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Somebody messaged you",
            title: "New Notification",
            icon: <AiFillBell />,
            position: "topR",
        });
        setIsApprovedValue(true);
    }

    return isApprovedValue ? (
        <p>It has been approved.</p>
    ) : (
        <button onClick={onApproveTap}>Approve</button>
    );
}

export default ApproveButton;

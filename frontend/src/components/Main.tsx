import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { BigNumber, ethers, ContractTransaction } from "ethers";

import { contractAddresses, abi } from "../constants";
import { AiFillBell } from "react-icons/ai";

interface contractAddressesInterface {
    [key: string]: string[];
}

function Main() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();

    const chainId: string = parseInt(chainIdHex!).toString();
    const escrowContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    const [escrowArrayLength, setEscrowArrayLength] = useState(0);

    const dispatch = useNotification();

    const { runContractFunction: getEscrowArrayLength } = useWeb3Contract({
        abi: abi,
        contractAddress: escrowContractAddress!,
        functionName: "getEscrowArrayLength",
        params: {},
    });

    const { runContractFunction: createNewEscrowContract } = useWeb3Contract({
        abi: abi,
        contractAddress: escrowContractAddress!,
        functionName: "createNewEscrowContract",
        params: {
            _beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            _arbiter: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        },
        msgValue: ethers.utils.parseEther("1").toString(),
    });

    const { runContractFunction: approve } = useWeb3Contract({
        abi: abi,
        contractAddress: escrowContractAddress!,
        functionName: "approve",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            updateInterface();
        }
    }, [isWeb3Enabled]);

    async function updateInterface() {
        const length = (await getEscrowArrayLength()) as BigNumber;
        setEscrowArrayLength(Number(length));
    }

    async function onCreateContractTap() {
        await createNewEscrowContract({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => {
                console.log(error);
            },
        });
    }

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
        updateInterface();
    }

    return escrowContractAddress ? (
        <div>
            <button onClick={onCreateContractTap}>
                Create New Escrow Contract
            </button>
            <button onClick={onApproveTap}>Approve</button>
            <h1>Escrow contracts created: {escrowArrayLength}</h1>
        </div>
    ) : (
        <h3>No contract adddress found for escrow contract of this chain.</h3>
    );
}

export default Main;

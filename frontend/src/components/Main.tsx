import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ethers, ContractTransaction } from "ethers";

import { contractAddresses, escrowFactoryAbi, escrowAbi } from "../constants";
import { AiFillBell } from "react-icons/ai";
import Escrow from "./Escrow";

interface contractAddressesInterface {
    [key: string]: string[];
}

function Main() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();

    const chainId: string = parseInt(chainIdHex!).toString();
    const escrowFactoryContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    let [deployedEscrowContractsAddresses, setDeployedEscrowContractAddresses] =
        useState<string[]>([]);

    const dispatch = useNotification();

    useEffect(() => {
        if (isWeb3Enabled) {
            updateInterface();
        }
    }, [isWeb3Enabled]);

    const { runContractFunction: createNewEscrowContract } = useWeb3Contract({
        abi: escrowFactoryAbi,
        contractAddress: escrowFactoryContractAddress!,
        functionName: "createNewEscrowContract",
        params: {
            _beneficiary: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            _arbiter: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        },
        msgValue: ethers.utils.parseEther("1").toString(),
    });

    const { runContractFunction: getEscrowContracts } = useWeb3Contract({
        abi: escrowFactoryAbi,
        contractAddress: escrowFactoryContractAddress!,
        functionName: "getEscrowContracts",
        params: {},
    });

    async function updateInterface() {
        const contracts = (await getEscrowContracts()) as string[];
        setDeployedEscrowContractAddresses(contracts);
    }

    async function onCreateContractTap() {
        await createNewEscrowContract({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => {
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
            },
        });
    }

    async function handleSuccess(tx: ContractTransaction) {
        await tx.wait(1);
        dispatch({
            type: "success",
            title: "Success",
            message: "New Escrow Contract Created.",
            icon: <AiFillBell />,
            position: "topR",
        });
        updateInterface();
    }

    return escrowFactoryContractAddress ? (
        <div>
            <button onClick={onCreateContractTap}>
                Create New Escrow Contract
            </button>
            <h1>
                Escrow contracts created:{" "}
                {deployedEscrowContractsAddresses.length}
            </h1>
            {deployedEscrowContractsAddresses.map((address, index) => (
                <Escrow
                    key={index}
                    index={index}
                    address={address}
                    escrowFactoryContractAddress={escrowFactoryContractAddress}
                />
            ))}
        </div>
    ) : (
        <h3>No contract adddress found for escrow contract of this chain.</h3>
    );
}

export default Main;

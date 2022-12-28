import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ethers, ContractTransaction } from "ethers";

import { contractAddresses, escrowFactoryAbi } from "../constants";
import { AiFillBell } from "react-icons/ai";
import Escrow from "./Escrow";
import { FilterItem } from "../utils/filterItem";
import Filter from "./Filter";
import CreateContract from "./CreateContract";

interface contractAddressesInterface {
    [key: string]: string[];
}

function Main() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const [filterItem, setFilterItem] = useState(FilterItem.All);

    const chainId: string = parseInt(chainIdHex!).toString();
    const escrowFactoryContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    let [deployedEscrowContractsAddresses, setDeployedEscrowContractAddresses] =
        useState<string[]>([]);

    useEffect(() => {
        if (isWeb3Enabled) {
            updateInterface();
        }
    }, [isWeb3Enabled]);

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

    return escrowFactoryContractAddress ? (
        <div className="mx-24 my-8">
            <CreateContract
                escrowFactoryContractAddress={escrowFactoryContractAddress}
                updateInterface={updateInterface}
            />
            <h1>
                Escrow contracts created:{" "}
                {deployedEscrowContractsAddresses.length}
            </h1>
            <Filter setFilterItem={setFilterItem} />
            {deployedEscrowContractsAddresses.map((address, index) => (
                <Escrow
                    key={index}
                    index={index}
                    address={address}
                    escrowFactoryContractAddress={escrowFactoryContractAddress}
                    filterItem={filterItem}
                />
            ))}
        </div>
    ) : (
        <h3>No contract adddress found for escrow contract of this chain.</h3>
    );
}

export default Main;

import { useMoralis, useWeb3Contract } from "react-moralis";
import { escrowAbi } from "../constants";
import { useEffect, useState } from "react";

import ApproveButton from "./ApproveButton";
import { FilterItem } from "../utils/filterItem";
import { BigNumber, ethers } from "ethers";

interface Props {
    address: string;
    index: number;
    escrowFactoryContractAddress: string;
    filterItem: FilterItem;
}

function Escrow({
    address,
    index,
    escrowFactoryContractAddress,
    filterItem,
}: Props): JSX.Element {
    const [depositorAddress, setDepositorAddress] = useState("");
    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const [arbiterAddress, setArbiterAddress] = useState("");
    const [isApprovedValue, setIsApprovedValue] = useState(false);
    const [balance, setBalance] = useState("0");

    const { account } = useMoralis();

    const { runContractFunction: depositor } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: address,
        functionName: "depositor",
        params: {},
    });

    const { runContractFunction: beneficiary } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: address,
        functionName: "beneficiary",
        params: {},
    });

    const { runContractFunction: arbiter } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: address,
        functionName: "arbiter",
        params: {},
    });

    const { runContractFunction: isApproved } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: address,
        functionName: "isApproved",
        params: {},
    });

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: escrowAbi,
        contractAddress: address,
        functionName: "getBalance",
        params: {},
    });

    useEffect(() => {
        (async () => {
            setDepositorAddress((await depositor()) as string);
            setBeneficiaryAddress((await beneficiary()) as string);
            setArbiterAddress((await arbiter()) as string);
            setIsApprovedValue((await isApproved()) as boolean);
            setBalance(((await getBalance()) as BigNumber).toString());
        })();
    }, []);

    const component = (
        <div className="bg-white mb-4 p-8">
            <div className="flex text-lg">
                <div className="w-3/12 font-bold">
                    <h1 className="py-4 pl-12">Contract Address</h1>
                    <h1 className="py-4 pl-12">Depositor Address</h1>
                    <h1 className="py-4 pl-12">Beneficiary Address</h1>
                    <h1 className="py-4 pl-12">Arbiter Address</h1>
                    <h1 className="py-4 pl-12">Value (ETH)</h1>
                </div>
                <div className=" bg-white">
                    <h1 className="py-4 pl-12">{address}</h1>
                    <h1 className="py-4 pl-12">{depositorAddress}</h1>
                    <h1 className="py-4 pl-12">{beneficiaryAddress}</h1>
                    <h1 className="py-4 pl-12">{arbiterAddress}</h1>
                    <h1 className="py-4 pl-12">
                        {balance}{" "}
                        <span>({ethers.utils.formatEther(balance)} ETH)</span>
                    </h1>
                </div>
            </div>
            <div className="text-center mt-8">
                <ApproveButton
                    index={index}
                    isApprovedValue={isApprovedValue}
                    escrowFactoryContractAddress={escrowFactoryContractAddress}
                    setIsApprovedValue={setIsApprovedValue}
                />
            </div>
        </div>
    );

    if (filterItem == FilterItem.All) {
        return component;
    } else if (filterItem == FilterItem.Approved) {
        return isApprovedValue ? component : <div></div>;
    } else if (filterItem == FilterItem.Unapproved) {
        return !isApprovedValue ? component : <div></div>;
    } else if (filterItem == FilterItem.MyCreated) {
        return depositorAddress.toLowerCase() == account?.toLowerCase() ? (
            component
        ) : (
            <div></div>
        );
    } else if (filterItem == FilterItem.MyApproval) {
        return arbiterAddress.toLowerCase() == account?.toLowerCase() &&
            !isApprovedValue ? (
            component
        ) : (
            <div></div>
        );
    } else if (filterItem == FilterItem.MyApproved) {
        return arbiterAddress.toLowerCase() == account?.toLowerCase() &&
            isApprovedValue ? (
            component
        ) : (
            <div></div>
        );
    } else {
        return <div></div>;
    }
}

export default Escrow;

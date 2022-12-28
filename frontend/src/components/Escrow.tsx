import { useWeb3Contract } from "react-moralis";
import { escrowAbi } from "../constants";
import { useEffect, useState } from "react";

import ApproveButton from "./ApproveButton";
import { FilterItem } from "../utils/filterItem";

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

    useEffect(() => {
        (async () => {
            setDepositorAddress((await depositor()) as string);
            setBeneficiaryAddress((await beneficiary()) as string);
            setArbiterAddress((await arbiter()) as string);
            setIsApprovedValue((await isApproved()) as boolean);
        })();
    }, []);

    const component = (
        <div>
            <h1>{address}</h1>
            <h1>{depositorAddress}</h1>
            <h1>{beneficiaryAddress}</h1>
            <h1>{arbiterAddress}</h1>
            <ApproveButton
                index={index}
                escrowFactoryContractAddress={escrowFactoryContractAddress}
                isApprovedValue={isApprovedValue}
                setIsApprovedValue={setIsApprovedValue}
            />
        </div>
    );

    return filterItem == FilterItem.All ? (
        component
    ) : filterItem == FilterItem.Approved ? (
        isApprovedValue ? (
            component
        ) : (
            <div></div>
        )
    ) : !isApprovedValue ? (
        component
    ) : (
        <div></div>
    );
}

export default Escrow;

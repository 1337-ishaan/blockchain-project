import { useWeb3Contract } from "react-moralis";
import { escrowAbi } from "../constants";
import { useEffect, useState } from "react";

import ApproveButton from "./ApproveButton";

interface Props {
    address: string;
    index: number;
    escrowFactoryContractAddress: string;
}

function Escrow({
    address,
    index,
    escrowFactoryContractAddress,
}: Props): JSX.Element {
    const [depositorAddress, setDepositorAddress] = useState("");
    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const [arbiterAddress, setArbiterAddress] = useState("");

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

    useEffect(() => {
        (async () => {
            setDepositorAddress((await depositor()) as string);
            setBeneficiaryAddress((await beneficiary()) as string);
            setArbiterAddress((await arbiter()) as string);
        })();
    }, []);

    return (
        <div>
            <h1>{address}</h1>
            <h1>{depositorAddress}</h1>
            <h1>{beneficiaryAddress}</h1>
            <h1>{arbiterAddress}</h1>
            <ApproveButton
                index={index}
                escrowFactoryContractAddress={escrowFactoryContractAddress}
                escrowAddress={address}
            />
        </div>
    );
}

export default Escrow;

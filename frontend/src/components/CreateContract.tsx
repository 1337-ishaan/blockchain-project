import { useWeb3Contract } from "react-moralis";
import { escrowFactoryAbi } from "../constants";
import { ethers, ContractTransaction } from "ethers";
import { Input, useNotification } from "@web3uikit/core";
import { AiFillBell } from "react-icons/ai";
import { useState } from "react";

interface Props {
    escrowFactoryContractAddress: string;
    updateInterface: Function;
}

function CreateContract({
    escrowFactoryContractAddress,
    updateInterface,
}: Props) {
    const dispatch = useNotification();

    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const [arbiterAddress, setArbiterAddress] = useState("");
    const [value, setValue] = useState("0");

    const { runContractFunction: createNewEscrowContract } = useWeb3Contract({
        abi: escrowFactoryAbi,
        contractAddress: escrowFactoryContractAddress!,
        functionName: "createNewEscrowContract",
        params: {
            _beneficiary: beneficiaryAddress,
            _arbiter: arbiterAddress,
        },
        msgValue: ethers.utils.parseUnits(value, "ether").toString(),
    });

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
        setBeneficiaryAddress("");
        setArbiterAddress("");
        setValue("0");
        updateInterface();
    }

    return (
        <div className="bg-white px-24 py-8">
            <h1 className="mb-10 text-2xl text-[#0D72C4] font-bold">
                Create New Escrow Contract
            </h1>
            <form
                className="h-72 flex flex-col justify-between"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (Number(value) <= 0) {
                        dispatch({
                            type: "warning",
                            title: "Invalid Input",
                            message: "Value should be greater than zero.",
                            icon: <AiFillBell />,
                            position: "topR",
                        });
                        return;
                    }
                    onCreateContractTap();
                }}
            >
                <Input
                    width="auto"
                    label="Beneficiary Address"
                    name="beneficiaryAddress"
                    onChange={(event) =>
                        setBeneficiaryAddress(event.target.value)
                    }
                    validation={{
                        required: true,
                        characterMaxLength: 42,
                        characterMinLength: 42,
                    }}
                    errorMessage="Invalid Address."
                    value={beneficiaryAddress}
                />
                <Input
                    width="auto"
                    label="Arbiter Address"
                    name="arbiterAddress"
                    onChange={(event) => setArbiterAddress(event.target.value)}
                    validation={{
                        required: true,
                        characterMaxLength: 42,
                        characterMinLength: 42,
                    }}
                    errorMessage="Invalid Address."
                    value={arbiterAddress}
                />
                <Input
                    width="auto"
                    label="Value (ETH)"
                    name="value"
                    type="number"
                    onChange={(event) => {
                        const { value } = event.target;
                        if (value) {
                            setValue(value);
                        }
                    }}
                    validation={{
                        required: true,
                    }}
                    errorMessage="Invalid Value."
                    value={value}
                />
                <button className="text-xl p-2 bg-[#0D72C4] text-white w-1/6 rounded-lg mx-auto">
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreateContract;

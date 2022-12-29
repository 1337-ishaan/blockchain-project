import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, getNamedAccounts } from "hardhat";
import { EscrowFactory } from "../typechain-types";
import { ContractReceipt, ContractTransaction } from "ethers";

const ESCROW_CONTRACT_INDEX = 0;

const createFunction: () => Promise<void> = async () => {
    const { deployer } = await getNamedAccounts();

    const escrowFactory: EscrowFactory = await ethers.getContract(
        "EscrowFactory",
        deployer
    );

    console.log(`EscrowFactory contract address: ${escrowFactory.address}`);

    const signers: SignerWithAddress[] = await ethers.getSigners();

    const depositer: SignerWithAddress = signers[1];
    const beneficiary: SignerWithAddress = signers[2];
    const arbiter: SignerWithAddress = signers[3];

    const tx: ContractTransaction = await escrowFactory
        .connect(arbiter)
        .approve(ESCROW_CONTRACT_INDEX);

    await tx.wait(1);

    console.log(`Approved.`);
    console.log(`Balance of beneficiary: ${await beneficiary.getBalance()}`);
};

createFunction()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

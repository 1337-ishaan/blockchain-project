import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, getNamedAccounts } from "hardhat";
import { EscrowFactory } from "../typechain-types";
import { ContractReceipt, ContractTransaction } from "ethers";

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
        .connect(depositer)
        .createNewEscrowContract(beneficiary.address, arbiter.address, {
            value: ethers.utils.parseEther("1"),
        });
    await tx.wait(1);
    console.log(`New Escrow Contract Created.`);
};

createFunction()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

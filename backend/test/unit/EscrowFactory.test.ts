import { deployments, ethers, getNamedAccounts } from "hardhat";
import { EscrowFactory } from "../../typechain-types";
import { assert, expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";

describe("EscrowFactory", () => {
    let escrowFactory: EscrowFactory;
    let deployer: string;

    before(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        escrowFactory = await ethers.getContract("EscrowFactory", deployer);
    });

    it("should create a new escrow contract", async () => {
        // * get the accounts.
        const [deployer, arbiter, depositer, beneficiary] =
            await ethers.getSigners();

        // * deploy the new escrow contract.
        const tx: ContractTransaction = await escrowFactory
            .connect(arbiter)
            .createNewEscrowContract(depositer.address, beneficiary.address);
        await tx.wait(1);

        // * `escrowArray` and `ownerToContractIndex` should be updated.
        const length: BigNumber = await escrowFactory.getEscrowArrayLength();
        const index: BigNumber = await escrowFactory.ownerToContractIndex(
            arbiter.address
        );

        assert(length.toString() == "1");
        assert(index.toString() == "1");
    });
});

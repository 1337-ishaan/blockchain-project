import { deployments, ethers, getNamedAccounts } from "hardhat";
import { EscrowFactory, Escrow } from "../../typechain-types";
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

    describe("createNewEscrowContract", () => {
        it("should create a new escrow contract", async () => {
            // * get the accounts.
            const [deployer, arbiter, depositer, beneficiary] =
                await ethers.getSigners();

            // * deploy the new escrow contract.
            const tx: ContractTransaction = await escrowFactory
                .connect(arbiter)
                .createNewEscrowContract(
                    depositer.address,
                    beneficiary.address
                );
            await tx.wait(1);

            // * `escrowArray` and `ownerToContractIndex` should be updated.
            const length: BigNumber =
                await escrowFactory.getEscrowArrayLength();
            const index: BigNumber = await escrowFactory.ownerToContractIndex(
                arbiter.address
            );

            assert(length.toString() == "1");
            assert(index.toString() == "1");
        });

        it("should not create another contract until first is open.", async () => {
            // * get the accounts.
            const [deployer, arbiter, depositer, beneficiary] =
                await ethers.getSigners();

            await expect(
                escrowFactory
                    .connect(arbiter)
                    .createNewEscrowContract(
                        depositer.address,
                        beneficiary.address
                    )
            )
                .to.be.revertedWithCustomError(
                    escrowFactory,
                    "EscrowFactory__EscrowContractExistWithThisAddress"
                )
                .withArgs(arbiter.address);
        });
    });

    describe("approve", async () => {
        it("should throw error is contract does not exist.", async () => {
            // * get the accounts.
            const randomAccount = (await ethers.getSigners())[4];

            await expect(escrowFactory.connect(randomAccount).approve())
                .to.be.revertedWithCustomError(
                    escrowFactory,
                    "EscrowFactory__NoContractFound"
                )
                .withArgs(randomAccount.address);
        });

        it("should approve the contract.", async () => {
            // * get the accounts.
            const [deployer, arbiter] = await ethers.getSigners();

            const tx: ContractTransaction = await escrowFactory
                .connect(arbiter)
                .approve();
            await tx.wait(1);

            // * it should be true.
            assert(escrowFactory.isArbiterContractApproved(arbiter.address));
        });
    });
});

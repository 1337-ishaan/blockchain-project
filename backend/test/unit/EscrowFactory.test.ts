import { deployments, ethers, getNamedAccounts } from "hardhat";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
import { EscrowFactory, Escrow } from "../../typechain-types";
import { assert, expect } from "chai";
import { ContractTransaction } from "ethers";

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
            const [deployer, depositer, beneficiary, arbiter] =
                await ethers.getSigners();

            // * deploy the new escrow contract.
            const tx: ContractTransaction = await escrowFactory
                .connect(depositer)
                .createNewEscrowContract(beneficiary.address, arbiter.address, {
                    value: ethers.utils.parseEther("1"),
                });
            await tx.wait(1);

            const escrowContracts = await escrowFactory.getEscrowContracts();

            const escrow: Escrow = await ethers.getContractAt(
                "Escrow",
                escrowContracts[0]
            );
            const balance = (await escrow.getBalance()).toString();

            assert(escrowContracts.length == 1);
            assert(balance > "0");
        });
    });

    describe("approve", async () => {
        it("should revert if msg.sender is not an arbiter", async () => {
            // * get the accounts.
            const randomAccount = (await ethers.getSigners())[4];

            await expect(escrowFactory.connect(randomAccount).approve(0))
                .to.be.revertedWithCustomError(
                    escrowFactory,
                    "EscrowFactory__NotAnArbiterOfContract"
                )
                .withArgs(randomAccount.address);
        });

        it("should approve the contract.", async () => {
            // * get the accounts.
            const arbiter = (await ethers.getSigners())[3];

            const arbiterContract = escrowFactory.connect(arbiter);

            const tx: ContractTransaction = await arbiterContract.approve(0);
            await tx.wait(1);

            const escrowContracts = await arbiterContract.getEscrowContracts();
            const escrow: Escrow = await ethers.getContractAt(
                "Escrow",
                escrowContracts[0]
            );
            // * it should be true.
            assert(escrow.isApproved());
        });

        it("should throw error if already approved.", async () => {
            // * get the accounts.
            const arbiter = (await ethers.getSigners())[3];

            await expect(escrowFactory.connect(arbiter).approve(0))
                .to.be.revertedWithCustomError(
                    escrowFactory,
                    "EscrowFactory__AlreadyApproved"
                )
                .withArgs(anyValue);
        });
    });
});

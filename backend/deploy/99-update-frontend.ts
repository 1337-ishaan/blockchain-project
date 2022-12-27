import { DeployFunction } from "hardhat-deploy/dist/types";
import fs from "fs";
import { ethers, network } from "hardhat";
import { EscrowFactory } from "../typechain-types";

const FRONTEND_CONTRACT_ADDRESSES_FILE_PATH: string =
    "../frontend/src/constants/contractAddresses.json";
const FRONTEND_ESCROW_FACTORY_ABI_FILE_PATH: string =
    "../frontend/src/constants/escrow-factory-abi.json";
const FRONTEND_ESCROW_ABI_FILE_PATH =
    "../frontend/src/constants/escrow-abi.json";
const ESCROW_CONTRACT_ABI_LOCATION =
    "artifacts/contracts/Escrow.sol/Escrow.json";

const updateFrontendFunction: DeployFunction = async () => {
    if (process.env.UPDATE_FRONTEND == "true") {
        console.log("Updating the frontend...");
        await updateContractAddresses();
        await updateAbi();
        console.log("Done!");
    }
};

async function updateAbi() {
    const escrowFactory = await ethers.getContract("EscrowFactory");

    fs.writeFileSync(
        FRONTEND_ESCROW_FACTORY_ABI_FILE_PATH,
        JSON.parse(
            JSON.stringify(
                escrowFactory.interface.format(ethers.utils.FormatTypes.json)
            )
        )
    );

    const data = fs.readFileSync(ESCROW_CONTRACT_ABI_LOCATION, "utf-8");
    fs.writeFileSync(
        FRONTEND_ESCROW_ABI_FILE_PATH,
        JSON.stringify(JSON.parse(data).abi)
    );
}

async function updateContractAddresses() {
    // * get the contract.
    const escrowFactory: EscrowFactory = await ethers.getContract(
        "EscrowFactory"
    );
    // * read the contracts array file from frontend (check the location twice).
    const contractAddresses = JSON.parse(
        fs.readFileSync(FRONTEND_CONTRACT_ADDRESSES_FILE_PATH, "utf-8")
    );
    // * read the chainId.
    const chainId: string | undefined = network.config.chainId?.toString();

    // * if chainId is undefined show the message.
    if (chainId != undefined) {
        // * check whether the chainId already exist in array or not.
        if (chainId in contractAddresses) {
            // * if yes then check whether the array already contains the address or not.
            if (
                !contractAddresses[network.config.chainId!].includes(
                    escrowFactory.address
                )
            ) {
                // * if not then push this new address to existing addresses of contract.
                contractAddresses[network.config.chainId!].push(
                    escrowFactory.address
                );
            }
        } else {
            // * if not then create the new array of contract addresses.
            contractAddresses[network.config.chainId!] = [
                escrowFactory.address,
            ];
        }
        fs.writeFileSync(
            FRONTEND_CONTRACT_ADDRESSES_FILE_PATH,
            JSON.stringify(contractAddresses)
        );
    } else {
        console.log(
            `ChainId is undefined, here is the value of it: ${chainId}`
        );
    }
}

export default updateFrontendFunction;
updateFrontendFunction.tags = ["all", "frontend"];

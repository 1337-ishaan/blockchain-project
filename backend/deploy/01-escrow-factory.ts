import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { network } from "hardhat";
import verify from "../utils/verify";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployEscrowFactory: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const escrowFactory: DeployResult = await deploy("EscrowFactory", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });

    // * only verify on testnets or mainnets.
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(escrowFactory.address, []);
    }
};

export default deployEscrowFactory;
deployEscrowFactory.tags = ["all", "factory"];

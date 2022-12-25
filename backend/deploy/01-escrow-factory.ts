import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { network } from "hardhat";

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

    await deploy("EscrowFactory", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });
};

export default deployEscrowFactory;
deployEscrowFactory.tags = ["all", "factory"];

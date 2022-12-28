import { ConnectButton } from "@web3uikit/web3";

function Header(): JSX.Element {
    return (
        <div className="flex">
            <h1 className="mr-auto">Decentralized Escrow</h1>
            <ConnectButton />
        </div>
    );
}

export default Header;

import { ConnectButton } from "@web3uikit/web3";

function Header(): JSX.Element {
    return (
        <div className="px-24 flex py-8 flex-row justify-between items-center bg-white border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-indigo-500">
                Decentralized Escrow
            </h1>
            <ConnectButton />
        </div>
    );
}

export default Header;

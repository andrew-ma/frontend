import React from "react";
import { ConnectWallet } from "./ConnectWallet";

export class SignIn extends React.Component {
    /*
    SignIn component checks if we have metamask installed,
    if no metamask, then show get metamask page
    */

    render() {
        // first check if we have metamask installed
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
            this.props.history.push("/install");
        }

        // show the Connect Button
        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the user's address
        // So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        return (
            <ConnectWallet
                onClickConnectButton={() => {
                    if (this.props.onClickConnectButton()) {
                        // Go to page once logged in successfully
                        this.props.history.replace("/browse");
                    }
                }}
            />
        );
    }
}

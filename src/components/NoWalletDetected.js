import React from "react";

export class NoWalletDetected extends React.Component {
    render() {
        if (window.ethereum !== undefined) {
            // go back to last page
            this.props.history.goBack();
        }

        return (
            <div className="container NoWalletDetected__container">
                <div className="p-4 text-center">
                    <h1 className="NoWalletDetected__header">You need an Ethereum wallet</h1>
                    <img className="NoWalletDetected__image" src="https://opensea.io/static/images/logos/metamask-alternative.png" alt="" />
                    <p className="NoWalletDetected__message">Please Install Metamask</p>
                    <a className="NoWalletDetected__link btn btn-primary btn-lg" href="https://metamask.io/download.html">
                        Get MetaMask
                    </a>
                </div>
            </div>
        );
    }
}

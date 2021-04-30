import React from "react";

import MetaMaskSVG from "../images/metamask.svg";

export class ConnectWallet extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="container ConnectWallet__container">
                        <div className="p-4 text-center">
                            <h1 className="ConnectWallet__header">Get Started</h1>
                            <p className="ConnectWallet__message">Connect to your wallet with MetaMask</p>
                            <button
                                onClick={this.props.onClickConnectButton}
                                className="ConnectWallet__button btn btn-warning btn-lg"
                                href="https://metamask.io/download.html">
                                <img className="ConnectWallet__button-icon" src={MetaMaskSVG} alt="" />
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

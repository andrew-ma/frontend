import React from "react";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";

export class DemoApp extends React.Component {
    /*
    SignIn component checks if we have metamask installed,
    if no metamask, then show get metamask page
    */
    constructor(props) {
        super(props);
        this.state = { networkError: undefined };
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    render() {
        const { tokenData, balance, transactionError, txBeingSent, selectedAddress } = this.props;

        // first check if we have metamask installed
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
            this.props.history.push("/install");
        }

        // show the Connect Button
        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, weto= are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.

        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        if (!tokenData || !balance) {
            return <Loading />;
        }

        // If everything is loaded, we render the application.
        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            {tokenData.name} ({tokenData.symbol})
                        </h1>
                        <p>
                            Welcome <b>{selectedAddress}</b>, you have{" "}
                            <b>
                                {balance.toString()} {tokenData.symbol}
                            </b>
                            .
                        </p>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-12">
                        {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
                        {txBeingSent && <WaitingForTransactionMessage txHash={txBeingSent} />}

                        {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
                        {transactionError && (
                            <TransactionErrorMessage
                                message={this._getRpcErrorMessage(transactionError)}
                                dismiss={() => this._dismissTransactionError()}
                            />
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
                        {balance.eq(0) && <NoTokensMessage selectedAddress={selectedAddress} />}

                        {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
                        {balance.gt(0) && (
                            <Transfer transferTokens={(to, amount) => this._transferTokens(to, amount)} tokenSymbol={tokenData.symbol} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

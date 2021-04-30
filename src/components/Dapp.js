import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Navbar } from "./Navbar";
import { NotFound } from "./NotFound";
import { SignIn } from "./SignIn";
import { NoWalletDetected } from "./NoWalletDetected";
import { CreateAsset } from "./CreateAsset";
import { Assets } from "./Assets";
import { AssetDetails } from "./AssetDetails";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import CONTRACT_ARTIFACT from "../contracts/Token.json";
import CONTRACT_ADDRESS from "../contracts/DeployedAddress.json";

// how often to poll contract data to keep in sync with frontend
const POLL_DATA_INTERVAL = 2000; // in milliseconds

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = "31337";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.

export class Dapp extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            selectedAddress: undefined,
            balance: undefined,
            alertText: undefined,
            alertClass: undefined,
            tokenData: undefined,
        };

        // initialize this.state object
        this.state = this.initialState;

        // Class variables
        //  set in _initializeEthers()
        this._Web3Provider = undefined;
        this._Contract = undefined;

        // Saved poll interval to clear later
        this._PollDataInterval = undefined;
    }

    render() {
        // show Navbar and MainBody on every page
        return (
            <React.Fragment>
                <Route render={(props) => <Navbar {...props} isLoggedIn={!!this.state.selectedAddress}></Navbar>}></Route>

                <div className="container-xl MainBody">
                    <div className={"MainBody__alert " + this._getAlertClasses()} role="alert">
                        {this.state.alertText}
                    </div>

                    <Switch>
                        <Route
                            path="/sign-in"
                            exact
                            render={(props) => <SignIn {...props} onClickConnectButton={() => this._connectWallet()}></SignIn>}></Route>
                        <Route path="/install" exact component={NoWalletDetected}></Route>
                        <Route path="/create" exact render={(props) => <CreateAsset {...props} setAlert={this._setAlert}></CreateAsset>}></Route>
                        <Route path="/account" exact component={NotFound}></Route>
                        <Route path="/accounts/:id" exact component={NotFound}></Route>
                        <Route path="/browse" exact render={(props) => <Assets {...props}></Assets>}></Route>
                        <Route path="/asset/:id" exact render={(props) => <AssetDetails {...props}></AssetDetails>}></Route>
                        {/* <Route path="/" exact component={NotFound}></Route> */}
                        <Redirect from="/" exact to="/browse"></Redirect>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }

    componentWillUnmount() {
        this._stopPollingData();
    }

    /////////////////////////////////////////////////////////////////////////////
    // State variables setters
    _setSelectedAddress = (selectedAddress) => {
        this.setState({ selectedAddress: selectedAddress });
    };

    _setBalance = (balance) => {
        this.setState({ balance: balance });
    };

    /////////////////////////////////////////////////////////////////////////////
    // Alert Messages on main page
    _setAlert = (alertText, alertClass = "danger") => {
        // when alertText is undefined, it dismisses the alert
        this.setState({ alertText: alertText, alertClass: alertClass });
    };

    _getAlertClasses = () => {
        let classes = "alert";
        let alertClass = "primary";
        if (this.state.alertClass) {
            switch (this.state.alertClass) {
                case "primary":
                case "secondary":
                case "success":
                case "danger":
                case "warning":
                case "info":
                case "light":
                case "dark":
                    alertClass = this.state.alertClass;
                    break;
                default:
            }
        }
        classes += ` alert-${alertClass}`;

        if (!this.state.alertText) {
            classes += " hidden";
        }
        return classes;
    };

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    async _connectWallet() {
        // run when user clicks the connect button
        // it connects to the user's wallet and initializes it

        // to connect to the user's wallet, we have to run this method window.ethereum.enable(), which returns a promise that resolves to the user's address
        // this method returns promise resolved with Array of accounts if user approves access, or rejected with Error if user rejects access
        let accountsArray;
        try {
            accountsArray = await window.ethereum.enable();
        } catch (err) {
            this._setAlert("User rejected access in MetaMask", "danger");
            return false;
        }

        const selectedAddress = accountsArray[0];
        console.log("User selected", selectedAddress);

        // once we have the address, we can initialize the app
        // first check the network, and don't initialize if wrong network
        if (!this._checkNetwork()) {
            return false;
        }

        // if on the right network, then initialize the selected Address
        this._initialize(selectedAddress);

        // reinitialize whenever user changes their account, so listen to "accountsChanged" event for window.ethereum
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // accountsChanged event can have undefined newAddress, not just if account changed
            // when user removes the Dapp from the Connected list of sites allowed access to your addresses
            // first check if newAddress is undefined
            if (newAddress === undefined) {
                return this._resetState();
            }

            // if valid newAddress, then initialize with newAddress
            this._initialize(newAddress);
        });

        // reset the state if network/chain changed
        window.ethereum.on("chainChanged", ([networkId]) => {
            this._stopPollingData();
            this._resetState();
        });
    }

    /////////////////////////////////////////////////////////////////////////////

    _checkNetwork = () => {
        // check if metamask selected network is "localhost:8545"

        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            // dismiss alert
            this._setAlert(undefined);
            return true;
        } else {
            // show error message if wrong network
            this._setAlert("Please connect Metamask to the Localhost:8545 network", "danger");
            return false;
        }
    };

    _initialize = (newAddress) => {
        console.log("Initializing with wallet address", newAddress);
        this._setAlert(`Initializing with wallet address: ${newAddress}`, "success");
        // initialize the dapp with newAddress

        // store newAddress in the state
        this.setState({ selectedAddress: newAddress });

        // initialize ethers, fetch the token's data, and start polling for user's balance

        this._initializeWeb3ProviderAndContract();
        this._updateTokenDataState();
        this._startPollingData();
    };

    _resetState = () => {
        // reset the this.state object
        this.setState(this.initialState);
    };

    /////////////////////////////////////////////////////////////////////////////

    _startPollingData = () => {
        // We are polling data from contract, to make sure that the frontend state and blockchain step are synced
        // we are saving this interval, so we can stop it to prevent memory leaks
        this._PollDataInterval = setInterval(() => {
            this._updateBalanceState();
        }, POLL_DATA_INTERVAL);

        // run it once immediately after calling this function
        this._updateBalanceState();
    };

    _stopPollingData = () => {
        clearInterval(this._PollDataInterval);
        this._PollDataInterval = undefined;
    };

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    async _initializeWeb3ProviderAndContract() {
        // Initialized Web3Provider and Contract are saved in class variables

        // first initialize ethers by creating a provider using window.ethereum
        this._Web3Provider = new ethers.providers.Web3Provider(window.ethereum);

        // initialize the contract using the provider and the token's artifact
        // CONTRACT_NAME is key in json file, to get the address of the deployed smart contract
        this._Contract = new ethers.Contract(CONTRACT_ADDRESS.DeployedAddress, CONTRACT_ARTIFACT.abi, this._Web3Provider.getSigner(0));
    }

    async _updateBalanceState() {
        //query the deployed smart contract's balanceOf a specific address
        const balance = await this._Contract.balanceOf(this.state.selectedAddress);
        console.log("Updated balance", balance);
        this.setState({ balance: balance });
    }

    async _updateTokenDataState() {
        // Querying the contract for its name and symbol, and saving in state
        const name = await this._Contract.name();
        const symbol = await this._Contract.symbol();
        console.log(`Updated Token Data: Name=${name} Symbol=${symbol}`);
        this.setState({ tokenData: { name: name, symbol: symbol } });
    }

    /////////////////////////////////////////////////////////////////////////////
}

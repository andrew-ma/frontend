import React from "react";

import axios from "axios";

import { isNetworkError } from "../helpers/isNetworkError";

export class CreateAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadFileValue: null,
            assetNameValue: "",
            assetPriceValue: 1,
            assetDescriptionValue: "",
            previewImageURL: null,
        };
    }

    ////////////////////////////////////////////////////////////////////////////

    handleCreateAsset = (event) => {
        event.preventDefault();
        console.log("Create Asset");
    };

    handleChangeUploadFile = (event) => {
        const file = event.target.files[0];
        if (file.size > 2048 * 1024) {
            this.props.setAlert(`"${file.name}" file size too large `, "danger");
            this.setState({ uploadFileValue: null, previewImageURL: null });
        } else {
            this.setState({ uploadFileValue: file, previewImageURL: URL.createObjectURL(file) });
        }
    };

    handleChangeAssetName = (event) => {
        this.setState({ assetNameValue: event.target.value });
    };

    handleChangeAssetPrice = (event) => {
        this.setState({ assetPriceValue: event.target.value });
    };

    handleChangeAssetDescription = (event) => {
        this.setState({ assetDescriptionValue: event.target.value });
    };

    writeToDatabase = async (tokenId, assetName, assetDescription, fileObj, assetPrice, tokenOwner) => {
        // Second, make a POST request to save metadata to backend with that newTokenId
        // upload the file to server first
        const formData = new FormData();
        formData.append("imageFile", fileObj, fileObj.name);
        formData.append("assetName", assetName);
        formData.append("assetDescription", assetDescription);
        formData.append("tokenId", tokenId);
        formData.append("assetPrice", assetPrice);
        formData.append("tokenOwner", tokenOwner);

        // Wait for post request promise to resolve
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token`, formData);
            this.props.setAlert(`Saved values to database for Token ${response.data.tokenId}`, "success");
        } catch (error) {
            if (isNetworkError(error)) {
                // if Network error
                this.props.setAlert(`Can't connect to backend: ${process.env.REACT_APP_BACKEND_URL}/token`, "danger");
            } else {
                // otherwise Axios error is error.response.data
                console.error(error.response.data);
                this.props.setAlert(error.response.data, "danger");
            }
        }
    };

    getNewestTokenIdAndOwnerFromContract = async () => {
        try {
            const tx = await this.props.Contract.createNewToken();
            const receipt = await tx.wait();
            // console.log("receipt", receipt);
            const TransferEvents = receipt.events.filter((e) => e.event === "Transfer");

            // const { blockHash, cumulativeGasUsed, from: TokenOwner, to: ContractAddress, transactionHash } = receipt;

            // console.log(`Block Hash: ${blockHash}`);
            // console.log(`Contract Address: ${ContractAddress}`);
            // console.log(`Transaction Hash: ${transactionHash}`);
            // console.log(`Used ${cumulativeGasUsed.toNumber()} gas`);
            // console.log(`TokenOwner: ${TokenOwner}, ${TransferEvents[0].args.to}`);
            // console.log(`TokenId: ${TransferEvents[0].args.tokenId.toNumber()}`);

            const { from: tokenOwner } = receipt;
            const tokenId = TransferEvents[0].args.tokenId.toNumber();
            return [tokenId, tokenOwner];
        } catch (error) {
            this.props.setAlert(error.message, "danger");
            console.error(error.message);
        }
    };

    handleSubmitForm = async (e) => {
        e.preventDefault();

        const [tokenId, tokenOwner] = await this.getNewestTokenIdAndOwnerFromContract();
        console.log(`Token ID: ${tokenId}\nToken Owner: ${tokenOwner}`);

        await this.writeToDatabase(
            tokenId,
            this.state.assetNameValue,
            this.state.assetDescriptionValue,
            this.state.uploadFileValue,
            this.state.assetPriceValue,
            tokenOwner
        );
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        // clear Alert
        this.props.setAlert(undefined);

        if (this.props.Contract === undefined) {
            // go to sign-in page
            this.props.history.push("/sign-in");
        }
    }

    render() {
        return (
            <div className="createasset__container">
                <h1>Create New Asset</h1>
                <form onSubmit={this.handleSubmitForm}>
                    <div className="form-group">
                        <label htmlFor="uploadfile__input">Upload an Image *</label>
                        <input
                            required
                            type="file"
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            className="form-control-file"
                            id="uploadfile__input"
                            onChange={this.handleChangeUploadFile}
                        />
                        <small id="uploadfile__help" className="form-text text-muted">
                            File types supported: JPG, PNG, GIF, WEBP; Max File size: 2M
                        </small>
                        <img id="uploadfile__img" src={this.state.previewImageURL} alt="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assetname__input">Name of Asset *</label>
                        <input
                            required
                            type="text"
                            maxLength="30"
                            className="form-control"
                            id="assetname__input"
                            placeholder="Item Name"
                            value={this.state.assetNameValue}
                            onChange={this.handleChangeAssetName}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assetprice__input">Asset Price (gwei) *</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="1"
                            className="form-control"
                            id="assetprice__input"
                            value={this.state.assetPriceValue}
                            onChange={this.handleChangeAssetPrice}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assetdescription__input">Asset Description</label>
                        {/* <small id="assetdescription__help" className="form-text text-muted">
                            The description will be included on the item's detail page underneath its image .
                        </small> */}

                        <textarea
                            type="text"
                            maxLength="200"
                            className="form-control"
                            id="assetdescription__input"
                            placeholder="Provide a detailed description of your item."
                            value={this.state.assetDescriptionValue}
                            onChange={this.handleChangeAssetDescription}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        );
    }
}

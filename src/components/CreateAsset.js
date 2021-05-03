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

        // bind methods to this
        this._createNewToken = this._createNewToken.bind(this);
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

    _createNewToken = async () => {
        try {
            if (!this.state.uploadFileValue) {
                throw new Error("Need to add a valid file");
            }

            if (!this.state.assetNameValue) {
                throw new Error("Needs a valid Asset Name");
            }

            if (!this.state.assetPriceValue) {
                this.props.setAlert("Invalid Asset Price (must be greater than 0)", "danger");
                throw new Error("Needs a valid Asset Price");
            }
        } catch (error) {
            console.error(error);
            this.props.setAlert(error.message, "danger");
            return null;
        }

        ////////////////////////////////////////////////////////////////////////////

        // First, Create a new token on the Deployed Contract and get back the new token id
        let newTokenId = null;

        try {
            newTokenId = await this.props.contract.createNewToken();
            console.log("New token ID", newTokenId);
        } catch (error) {
            if (error.code === -32603) {
                // Nonce too high, show message to Reset Metamask account
                this.props.setAlert(
                    "Nonce is too high.\nTo fix, click on MetaMask extension\nClick on Account Picture\nClick Settings\nClick Advanced\nClick Reset Account Button",
                    "danger"
                );
            } else {
                console.log(error);
                this.props.setAlert(error.message, "danger");
            }
        }

        console.log("After contract.createNewToken:", newTokenId);
        if (newTokenId === null) {
            // Don't Post to database if Contract failed to createNewToken
            return null;
        }

        ////////////////////////////////////////////////////////////////////////////

        // Second, make a POST request to save metadata to backend with that newTokenId
        // upload the file to server first
        const formData = new FormData();
        formData.append("imageFile", this.state.uploadFileValue, this.state.uploadFileValue.name);
        formData.append("assetName", this.state.assetNameValue);
        formData.append("assetDescription", this.state.assetDescriptionValue);
        formData.append("tokenId", newTokenId);

        // Wait for post request promise to resolve
        try {
            const response = await axios.post("http://127.0.0.1:4000/token", formData);
            this.props.setAlert(`Successfully created Token ${response.data.tokenId}`, "success");
        } catch (error) {
            if (isNetworkError(error)) {
                // if Network error
                this.props.setAlert("Can't connect to backend: http://127.0.0.1:4000/token", "danger");
            } else {
                // otherwise Axios error is error.response.data
                console.error(error.response.data);
                this.props.setAlert(error.response.data, "danger");
            }
        }
    };

    handleSubmitForm = (e) => {
        e.preventDefault();
        console.log(`
        Name: ${this.state.assetNameValue}, ${typeof this.state.assetNameValue}
        Price: ${this.state.assetPriceValue}, ${typeof this.state.assetPriceValue}
        Description: ${this.state.assetDescriptionValue}, ${typeof this.state.assetDescriptionValue}
        File: ${this.state.uploadFileValue}, ${typeof this.state.uploadFileValue}
        `);

        this._createNewToken();
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        // clear Alert
        this.props.setAlert(undefined);

        if (!this.props.contract) {
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
                        <label htmlFor="assetprice__input">Asset Price (ether) *</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
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

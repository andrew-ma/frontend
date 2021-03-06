import React, { Component } from "react";
import axios from "axios";
import { isNetworkError } from "../helpers/isNetworkError";

import AssetCard from "./AssetCard";

export class Assets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tokenMetadataArray: [],
        };
    }

    getTokenMetadataStartToEndFromDatabase = async (startTokenId, endTokenId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tokens/?start=${startTokenId}&end=${endTokenId}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (isNetworkError(error)) {
                // if Network error
                this.props.setAlert(`Can't connect to backend: ${process.env.REACT_APP_BACKEND_URL}/tokens/`, "danger");
            } else {
                // otherwise Axios error is error.response.data
                // console.error(error.response.data);
                // this.props.setAlert(error.response.data, "danger");
            }
            return null;
        }
    };

    getAllTokenMetadata = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tokens/`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (isNetworkError(error)) {
                // if Network error
                this.props.setAlert(`Can't connect to backend: ${process.env.REACT_APP_BACKEND_URL}/tokens/`, "danger");
            } else {
                // otherwise Axios error is error.response.data
                // console.error(error.response.data);
                // this.props.setAlert(error.response.data, "danger");
            }
            return null;
        }
    };

    updateTokenMetadataArray = async (startTokenId, endTokenId) => {
        // Query the database for all assets
        const tokenMetadataArray = await this.getAllTokenMetadata();

        //// Query range of tokens
        // const tokenMetadataArray = await this.getTokenMetadataStartToEndFromDatabase(startTokenId, endTokenId);

        if (tokenMetadataArray !== null) {
            this.setState({ tokenMetadataArray: tokenMetadataArray });
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        // clear previous alert
        this.props.setAlert(undefined);

        this.updateTokenMetadataArray();
    }

    render() {
        return (
            <div>
                <h1>All Assets</h1>
                <div className="assets__grid">
                    {this.state.tokenMetadataArray.map((assetObj) => {
                        const { name, tokenOwner, description, price, tokenId, image } = assetObj;
                        return (
                            <AssetCard
                                key={tokenId}
                                assetName={name}
                                assetOwner={tokenOwner}
                                assetDescription={description}
                                assetPrice={price}
                                assetId={tokenId}
                                imageSrc={image}></AssetCard>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Assets;

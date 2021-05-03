import React, { Component } from "react";
import axios from "axios";
import { isNetworkError } from "../helpers/isNetworkError";

import AssetCard from "./AssetCard";

export class AccountDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tokenMetadataArray: [],
        };
    }

    getTokenMetadataByOwnerFromDatabase = async (tokenOwner) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tokens/?owner=${tokenOwner}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (isNetworkError(error)) {
                // if Network error
                this.props.setAlert(`Can't connect to backend: ${process.env.REACT_APP_BACKEND_URL}/token`, "danger");
            } else {
                // otherwise Axios error is error.response.data
                // console.error(error.response.data);
                // this.props.setAlert(error.response.data, "danger");
            }
            return null;
        }
    };

    updateTokenMetadataArray = async (tokenOwner) => {
        // Query the database for all assets

        const tokenMetadataArray = await this.getTokenMetadataByOwnerFromDatabase(tokenOwner);
        this.setState({ tokenMetadataArray: tokenMetadataArray });
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        // clear previous alert
        this.props.setAlert(undefined);
        const tokenOwner = this.props.match.params.id;
        this.updateTokenMetadataArray(tokenOwner);
    }

    render() {
        return (
            <div>
                <h1>My Assets</h1>
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

export default AccountDetails;

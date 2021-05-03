import React, { Component } from "react";
import axios from "axios";
import { isNetworkError } from "../helpers/isNetworkError";

import AssetCard from "./AssetCard";

export class Assets extends Component {
    getAllAssets = () => {
        // return [{ tokenId, name, description, image }];
        // this.props.contract, this.props.selectedAddress
        return [];
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {}

    render() {
        return (
            <div>
                <h1>All Assets</h1>
                <div className="assets__grid">
                    {this.getAllAssets().map((assetObj) => {
                        const { assetName, assetOwner, assetDescription, assetPrice, assetId, imageSrc } = assetObj;
                        return (
                            <AssetCard
                                key={assetId}
                                assetName={assetName}
                                assetOwner={assetOwner}
                                assetDescription={assetDescription}
                                assetPrice={assetPrice}
                                assetId={assetId}
                                imageSrc={imageSrc}></AssetCard>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Assets;

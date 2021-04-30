import React, { Component } from "react";
import AssetCard from "./AssetCard";

import { getAssetDetail, getAllAssets } from "../service/fakeservice";

export class Assets extends Component {
    render() {
        return (
            <div>
                <h1>All Assets</h1>
                <div className="assets__grid">
                    {getAllAssets().map((assetObj) => {
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

import React, { Component } from "react";
import { Link } from "react-router-dom";

export class AssetDetails extends Component {
    /*
    will look at url for asset ID
    then it will query the blockchain for that asset ID
    then it will get imageSrc, assetName, assetOwner, assetCreator, assetDescription, assetPrice
    
    it will also get the asset's contractAddress, tokenId, blockchain to put in chain info
    
    */

    state = {
        imageSrc:
            "https://lh3.googleusercontent.com/TFXs8L0v3Rj4cf9J6FCL1ZrhvgDmtJwPDl9gNpIR9uGb7VEPHyh1-eVK5vAC7c50NFZoCCqDjb4ofcyzMS1mGK7Nlk8eZ8aN0y9YII8=s271",
        assetName: "COolio",
        assetOwner: "JoeBiden",
        assetDescription: "foxnes",
        assetPrice: 10,
        assetId: "0xlkjlkjklj",
        assetCreator: "Bob the builder",
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    render() {
        return (
            <div className="AssetDetails__container">
                <div className="AssetDetails__summary">
                    <div className="card asset__card AssetDetails__image_card">
                        <img className="card-img-top AssetDetails__image" src={this.state.imageSrc} alt="" />
                    </div>
                    <div className="AssetDetails__details_card card">
                        <div className="AssetDetails__details_card-header card-header">Details</div>
                        <div className="AssetDetails__details_card-body card-body">
                            <img
                                className="AssetDetails__details__image"
                                src="https://lh3.googleusercontent.com/IKXt5JuFhcfceDlzCKHvZVdB6TLCbmGxiA6WmNbohRmez7Y92CeDLMXQjSApLA7cnj15WwCckgjhnQbWTSceKZB0VRwhcQvfyrlWY9Q=s44"
                                alt=""
                            />
                            Created by <Link to={`/accounts/${this.state.assetCreator}`}>{this.state.assetCreator}</Link>
                        </div>
                    </div>
                    <div className="AssetDetails__about_card card">
                        <div className="AssetDetails__about_card-header card-header">About</div>
                        <div className="AssetDetails__about_card-body card-body">{this.state.assetDescription}</div>
                    </div>

                    <div className="AssetDetails__chaininfo_card card">
                        <div className="AssetDetails__chaininfo_card-header card-header">Chain Info</div>
                        <div className="AssetDetails__chaininfo_card-body card-body">
                            <div className="AssetDetails__contract_address">
                                <div className="contract_address__label">Contract Address</div>
                                <div className="contract_address__value">
                                    <a href={`https://etherscan.io/address/${this.state.contractAddress}`}>{this.state.contractAddress}</a>
                                </div>
                            </div>
                            <div className="AssetDetails__token_id">
                                <div className="token_id__label">Token ID</div>
                                <div className="token_id__value">{this.state.tokenID}</div>
                            </div>
                            <div className="AssetDetails__blockchain">
                                <div className="blockchain__label">Blockchain</div>
                                <div className="blockchain__value">{this.state.blockchain}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="AssetDetails__main">
                    <div className="AssetDetails__header card ">
                        {/* <div className="asset_collection_name"></div> */}
                        <div className="AssetDetails__card-body card-body">
                            <div className="AssetDetails__asset_name">{this.state.assetName}</div>
                            <div className="AssetDetails__asset_owner">
                                <img
                                    className="AssetDetails__asset_owner__image"
                                    src="https://lh3.googleusercontent.com/IKXt5JuFhcfceDlzCKHvZVdB6TLCbmGxiA6WmNbohRmez7Y92CeDLMXQjSApLA7cnj15WwCckgjhnQbWTSceKZB0VRwhcQvfyrlWY9Q=s44"
                                    alt=""
                                />
                                Owned by{" "}
                                <span className="AssetDetails__asset_owner__link">
                                    <Link to={`/accounts/${this.state.assetOwner}`}>{this.state.assetOwner}</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="AssetDetails__price_card card">
                        <div className="AssetDetails__pricelabel card-header">Price</div>
                        <div className="AssetDetails__price_card-body card-body">
                            <div className="AssetDetails__pricevalue">
                                <div className="AssetDetails__pricevalue--coin">
                                    Ξ <span className="coinvalue">0.01</span>
                                </div>
                                {/* <div className="pricevalue--dollar">
                                ($<span className="dollarvalue"></span>)
                            </div> */}
                            </div>
                            <div className="AssetDetails__buybutton btn btn-primary btn--buy btn-lg">Buy Now</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AssetDetails;

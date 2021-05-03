import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { isNetworkError } from "../helpers/isNetworkError";

export class AssetDetails extends Component {
    /*
    will look at url for asset ID
    then it will query the blockchain for that asset ID
    then it will get imageSrc, assetName, assetOwner, assetCreator, description, price
    
    it will also get the asset's contractAddress, tokenId, blockchain to put in chain info
    
    */
    constructor(props) {
        super(props);

        this.state = {
            imageSrc: "",
            assetName: "",
            assetOwner: "",
            description: "",
            price: 0,
            tokenId: "",
            assetCreator: "",
        };
    }

    getTokenMetadataFromDatabase = async (tokenId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/token/${tokenId}`);
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

    updateAssetState = async (tokenId) => {
        const tokenMetadata = await this.getTokenMetadataFromDatabase(tokenId);
        if (tokenMetadata !== null) {
            const { image, name, tokenOwner, description, price } = tokenMetadata;

            this.setState({
                imageSrc: image,
                assetName: name,
                assetOwner: tokenOwner,
                description: description,
                price: price,
                tokenId: tokenId,
                assetCreator: tokenOwner,
            });
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        // clear previous alert
        this.props.setAlert(undefined);

        const tokenId = this.props.match.params.id;

        this.updateAssetState(tokenId);
    }

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
                        <div className="AssetDetails__about_card-body card-body">{this.state.description}</div>
                    </div>

                    <div className="AssetDetails__chaininfo_card card">
                        <div className="AssetDetails__chaininfo_card-header card-header">Chain Info</div>
                        <div className="AssetDetails__chaininfo_card-body card-body">
                            {/* <div className="AssetDetails__contract_address">
                                <div className="contract_address__label">Contract Address</div>
                                <div className="contract_address__value">
                                    <a href={`https://etherscan.io/address/${this.state.contractAddress}`}>{this.state.contractAddress}</a>
                                </div>
                            </div> */}
                            <div className="AssetDetails__token_id">
                                <div className="token_id__label">Token Id:</div>
                                <div className="token_id__value">{this.state.tokenId}</div>
                            </div>
                            {/* <div className="AssetDetails__blockchain">
                                <div className="blockchain__label">Blockchain</div>
                                <div className="blockchain__value">{this.state.blockchain}</div>
                            </div> */}
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
                                    Ξ <span className="coinvalue">{this.state.price}</span>
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

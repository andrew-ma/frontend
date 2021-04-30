import React, { Component } from "react";
import { Link } from "react-router-dom";

export class AssetCard extends Component {
    render() {
        return (
            <div className="card AssetCard">
                <Link to={`/asset/${this.props.assetId}`}>
                    <img className="card-img-top AssetCard__image" src={this.props.imageSrc} alt="" />
                    <div className="card-body AssetCard__body">
                        <h5 className="card-title AssetCard__asset_name">{this.props.assetName}</h5>
                        <p className="card-text AssetCard__asset_description">{this.props.assetDescription}</p>
                        <div className="card-text AssetCard__asset_price__container">
                            <div className="AssetCard__asset_price__label">Price</div>
                            <div className="AssetCard__asset_price__symbol">
                                {" "}
                                Ξ <span className="AssetCard__asset_price__value">{this.props.assetPrice}</span>
                            </div>
                        </div>
                        {/* <a href={`/asset/${this.props.assetId}`} className="btn btn-outline-primary AssetCard__details_button">
                        View Details
                    </a> */}
                    </div>
                </Link>
            </div>
        );
    }
}

export default AssetCard;

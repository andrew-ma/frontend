import React from "react";

export class CreateAsset extends React.Component {
    componentDidMount() {
        // on mount, api calls
        if (typeof window.ethereum === "undefined") {
            // console.error("MetaMask is not installed!");
            this.props.history.push("/need-metamask");
        } else {
        }
    }

    handleCreateAsset = (e) => {
        e.preventDefault();
        console.log("Create Asset");
    };

    handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file.size > 2048 * 1024) {
            this.props.setAlert(`"${file.name}" file size too large `, "danger");
        } else {
            this.props.setAlert(`Added "${file.name}"`, "primary");
        }
    };

    render() {
        return (
            <div className="createasset__container">
                <h1>Create New Asset</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="uploadfile__input">Upload an Image *</label>
                        <input
                            required
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={this.handleFileInput}
                            className="form-control-file"
                            id="uploadfile__input"
                        />
                        <small id="uploadfile__help" className="form-text text-muted">
                            File types supported: JPG, PNG, Max File size: 2M
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="assetname__input">Name of Asset *</label>
                        <input required type="text" maxLength="30" className="form-control" id="assetname__input" placeholder="Item Name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assetprice__input">Asset Price *</label>
                        <input required type="number" min="0" step="0.01" className="form-control" id="assetprice__input" placeholder="20" />
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
                            placeholder="Provide a detailed description of your item."></textarea>
                    </div>
                    <button onClick={() => this.handleCreateAsset()} type="submit" className="btn btn-primary">
                        Create
                    </button>
                </form>
            </div>
        );
    }
}

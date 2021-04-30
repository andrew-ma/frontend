export function getAssetDetail(assetId) {
    const assetObj = {
        imageSrc:
            "https://lh3.googleusercontent.com/TFXs8L0v3Rj4cf9J6FCL1ZrhvgDmtJwPDl9gNpIR9uGb7VEPHyh1-eVK5vAC7c50NFZoCCqDjb4ofcyzMS1mGK7Nlk8eZ8aN0y9YII8=s271",
        assetName: "COolio",
        assetOwner: "JoeBiden",
        assetDescription: "foxnes",
        assetPrice: 10,
        assetId: assetId,
    };
    return assetObj;
}

export function getAllAssets() {
    // const assetObjArr = [1, 2, 3, 4, 5].map((id) => getAssetDetail(id));
    let assetObjArr = [
        {
            imageSrc: "https://picsum.photos/200",
            assetName: "Test 1",
            assetOwner: "Jeff",
            assetDescription: "",
            assetPrice: 10,
            assetId: 1,
        },
        {
            imageSrc: "https://picsum.photos/300",
            assetName: "Test 2",
            assetOwner: "Jeff",
            assetDescription: "",
            assetPrice: 50,
            assetId: 2,
        },
        {
            imageSrc: "https://picsum.photos/400",
            assetName: "Test 3",
            assetOwner: "Jeff",
            assetDescription: "",
            assetPrice: 20.34,
            assetId: 3,
        },
        {
            imageSrc: "https://picsum.photos/500",
            assetName: "Test 4",
            assetOwner: "Jeff",
            assetDescription: "",
            assetPrice: 7.99,
            assetId: 4,
        },
        {
            imageSrc: "https://picsum.photos/600",
            assetName: "Test 5",
            assetOwner: "Jeff",
            assetDescription: "",
            assetPrice: 0.99,
            assetId: 5,
        },
    ];
    return assetObjArr;
}

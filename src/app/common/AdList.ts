export class AdList {
    id: number;
    adTitle: string;
    price: number;
    priceType: string;
    created: string;
    town: string;
    titleImgUrl: string;
    titleImgWidth: number;
    titleImgHeight: number;

    constructor(id: number, adTitle: string, price: number, priceType: string, created: string, town: string,
        titleImgUrl: string, titleImgWidth: number, titleImgHeight: number) {
        this.id = id;
        this.adTitle = adTitle;
        this.price = price;
        this.priceType = priceType;
        this.created = created;
        this.town = town;
        this.titleImgUrl = titleImgUrl;
        this.titleImgWidth = titleImgWidth;
        this.titleImgHeight = titleImgHeight;
    }
}
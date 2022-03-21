export class AdList {
    id: number;
    adTitle: string;
    price: number;
    priceType: string;
    created: string;
    imgTitleUrl: string;
    town: string;
    width: number;
    height: number;

    constructor(id: number, adTitle: string, price: number, priceType: string, created: string, imgTitleUrl: string, town: string, width: number, height: number) {
        this.id = id;
        this.adTitle = adTitle;
        this.price = price;
        this.priceType = priceType;
        this.created = created;
        this.imgTitleUrl = imgTitleUrl;
        this.town = town;
        this.width = width;
        this.height = height;
    }
}
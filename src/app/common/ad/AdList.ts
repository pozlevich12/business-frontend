import { SimpleLocation } from "../location/SimpleLocation";

export class AdList {
    id: number;
    adTitle: string;
    body: string;
    price: number;
    delivery: boolean;
    priceType: string;
    created: string;
    simpleLocation: SimpleLocation;
    titleImgUrl: string;
    titleImgWidth: number;
    titleImgHeight: number;

    constructor(id: number, adTitle: string, body: string, price: number, delivery: boolean, priceType: string, created: string, simpleLocation: SimpleLocation,
        titleImgUrl: string, titleImgWidth: number, titleImgHeight: number) {
        this.id = id;
        this.adTitle = adTitle;
        this.body = body;
        this.price = price;
        this.delivery = delivery;
        this.priceType = priceType;
        this.created = created;
        this.simpleLocation = simpleLocation;
        this.titleImgUrl = titleImgUrl;
        this.titleImgWidth = titleImgWidth;
        this.titleImgHeight = titleImgHeight;
    }
}
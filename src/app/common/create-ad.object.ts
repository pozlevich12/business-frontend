import { ImageDTO } from "./ImageDTO.object";

export class CreateAd {
    title: string;
    body: string;
    category: number;
    subCategory: number;
    town: number;
    price: number;
    priceType: string;
    imgList: ImageDTO[];
    phoneList: string[];
    delivery: boolean;
    deliveryDescription: string;

    constructor(title: string, body: string, category: number, subCategory: number, town: number,
        price: number, priceType: string, imgList: ImageDTO[], phoneList: string[], delivery: boolean, deliveryDescription: string) {
        this.title = title;
        this.body = body;
        this.category = category;
        this.subCategory = subCategory;
        this.town = town;
        this.price = price;
        this.priceType = priceType;
        this.imgList = imgList;
        this.phoneList = phoneList;
        this.delivery = delivery;
        this.deliveryDescription = deliveryDescription;
    }
}
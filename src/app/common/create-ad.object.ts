import { Image } from "./Image";

export class CreateAd {
    title: string = "";
    body: string = "";
    category: number | undefined;
    subCategory: number | undefined;
    region: number | undefined;
    town: number | undefined;
    price: string | undefined;
    priceType: string | undefined;
    imgList: Image[] = [];
    communicationList: number[] = [];
    delivery: boolean = false;
    deliveryDescription: string = "";
}
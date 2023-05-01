import { Image } from "../Image";

export class CreateAd {
    id: number | undefined;
    title: string = "";
    body: string = "";
    category: number | undefined;
    subCategory: number | undefined;
    location: number | undefined;
    price: string | undefined;
    priceType: string | undefined;
    imgList: Image[] = [];
    communicationList: number[] = [];
    delivery: boolean = false;
    deliveryDescription: string = "";
}
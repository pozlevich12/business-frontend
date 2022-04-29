import { Category } from "./Category";
import { Location } from "./Location";
import { Image } from "./Image";
import { User } from "./User";
import { Communication } from "./Communication";

export class Ad {
    id: number;
    title: string;
    body: string;
    created: Date;
    edited: Date;
    isEdited: boolean;
    delivery: boolean;
    deliveryDescription: string;
    price: number;
    priceType: string;
    author: User;
    category: Category;
    location: Location;
    imgList: Image[] = [];
    communications: Communication[] = [];

    constructor(ad: any) {
        this.id = ad.id;
        this.title = ad.title;
        this.body = ad.body;
        this.created = ad.created;
        this.edited = ad.edited;
        this.isEdited = ad.isEdited;
        this.delivery = ad.delivery;
        this.deliveryDescription = ad.deliveryDescription;
        this.price = ad.price;
        this.priceType = ad.priceType;
        this.author = ad.author;
        this.category = ad.category;
        this.location = ad.location;
    }
}
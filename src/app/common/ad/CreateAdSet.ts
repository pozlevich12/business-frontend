import { CategoriesObject } from "../categories.object";
import { Region } from "../location/Region";

export class CreateAdSet {
    categories: CategoriesObject[] | undefined;
    regions: Region[] | undefined;
    priceTypes: string[] | undefined;
}
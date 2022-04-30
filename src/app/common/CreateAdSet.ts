import { CategoriesObject } from "./categories.object";
import { LocationObject } from "./locations.object";

export class CreateAdSet {
    categories: CategoriesObject[] | undefined;
    locations: LocationObject[] | undefined;
    priceTypes: string[] | undefined;
}
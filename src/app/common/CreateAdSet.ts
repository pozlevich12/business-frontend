import { CategoriesObject } from "./categories.object";
import { Communication } from "./Communication";
import { LocationObject } from "./locations.object";

export class CreateAdSet {
    categories: CategoriesObject[] | undefined;
    locations: LocationObject[] | undefined;
    availableCommunications: Communication[] | undefined;
    priceTypes: string[] | undefined;
}
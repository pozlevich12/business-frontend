import { SubCategoryObject } from "./subcategory.object";

export class CategoriesObject {
    id: number;
    category: string;
    subCategoryList: SubCategoryObject[];

    constructor(categoriesResponse: any) {
        this.id = categoriesResponse.id;
        this.category = categoriesResponse.category;
        this.subCategoryList = categoriesResponse.subCategoryList;
    }
}
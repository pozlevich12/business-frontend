import { SubCategoryObject } from "./subcategory.object";

export class CategoriesObject {
    categoryId: number;
    categoryName: string;
    subCategories?: SubCategoryObject[];

    constructor(categoriesResponse: any) {
        this.categoryId = categoriesResponse.categoryId;
        this.categoryName = categoriesResponse.categoryName;
    }
}
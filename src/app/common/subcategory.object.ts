export class SubCategoryObject {
    id: number;
    subCategory: string;

    constructor(subCategory: any) {
        this.id = subCategory.id;
        this.subCategory = subCategory.subCategory;
    }
}
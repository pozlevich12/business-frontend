export class SubCategoryObject {
    subCategoryId: number;
    subCategoryName: string;

    constructor(subCategory: any) {
        this.subCategoryId = subCategory.subCategoryId;
        this.subCategoryName = subCategory.subCategoryName;
    }
}
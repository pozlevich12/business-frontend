export class Category {
    id: number;
    category: string;
    subCategoryId: number;
    subCategoryName: string;

    constructor(category: any) {
        this.id = category.id;
        this.category = category.category;
        this.subCategoryId = category.subCategoryId;
        this.subCategoryName = category.subCategoryName;
    }
}
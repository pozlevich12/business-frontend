export class AdFilter {
    categoryId: number | undefined;
    subCategoryId: number | undefined;
    region: number | undefined;
    town: number | undefined;
    delivery: boolean | undefined;
    limit: number = 15;
    offset: number = 0;
}
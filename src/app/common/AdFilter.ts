import { AdExecuteLimit } from "./AdExecuteLimit";

export class AdFilter {
    categoryId: number | undefined;
    subCategoryId: number | undefined;
    region: number | undefined;
    location: number | undefined;
    delivery: boolean | undefined;
    adListExecuteLimit: AdExecuteLimit | undefined;
}
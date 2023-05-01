import { AdExecuteLimit } from "../AdExecuteLimit";
import { AdList } from "./AdList";

export interface AdExecutor {
    uploadNextAdList(adExecuteLimit: AdExecuteLimit): Promise<AdList[]>;
    setAdList(adList: AdList[]): void;
    getAdList(): AdList[];
}
import { District } from "./District";

export class Region {
    id: number;
    name: string;
    districts: District[];

    constructor(object: any) {
        this.id = object.id;
        this.name = object.name;
        this.districts = object.districts;
    }
}
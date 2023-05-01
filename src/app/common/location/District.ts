import { Location } from "./Location";

export class District {
    id: number;
    name: string;
    locations: Location[];

    constructor(object: any) {
        this.id = object.id;
        this.name = object.name;
        this.locations = object.locations;
    }
}
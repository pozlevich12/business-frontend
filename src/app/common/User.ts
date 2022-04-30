import { Communication } from "./Communication";

export class User {
    id: number;
    phoneNumber: string;
    firstName: string;
    lastVisit: Date;
    roles: string;
    avatarUrl: string;
    favoriteAdList: number[];
    communicationList: Communication[];

    constructor(user: any) {
        this.id = user.id;
        this.phoneNumber = user.phoneNumber;
        this.firstName = user.firstName;
        this.lastVisit = user.lastVisit;
        this.roles = user.roles;
        this.avatarUrl = user.avatarUrl;
        this.communicationList = user.communicationList;
        this.favoriteAdList = user.favoriteAdList;
    }
}
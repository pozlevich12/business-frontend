import { Communication } from "./Communication";

export class User {
    id: number;
    phoneNumber: string;
    email: string;
    firstName: string;
    firstVisit: Date;
    lastVisit: Date;
    roles: string;
    avatarUrl: string;
    favoriteAdList: number[];
    communicationList: Communication[];

    constructor(user: any) {
        this.id = user.id;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.firstName = user.firstName;
        this.firstVisit = new Date(user.firstVisit);
        this.lastVisit = new Date(user.lastVisit);
        this.roles = user.roles;
        this.avatarUrl = user.avatarUrl;
        this.communicationList = user.communicationList;
        this.favoriteAdList = user.favoriteAdList;
    }
}
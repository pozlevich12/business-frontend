export class CreateAdValidation {
    title: boolean;
    body: boolean;
    deliveryDescription: boolean;

    constructor() {
        this.title = false;
        this.body = false;
        this.deliveryDescription = false;
    }
}
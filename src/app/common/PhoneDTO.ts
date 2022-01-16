export class PhoneDTO {
    phone: string | undefined;
    use: boolean = true;

    constructor(phone: string) {
        this.phone = phone;
    }
}
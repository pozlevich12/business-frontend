export class ImageDTO {
    cloudinaryId: string;
    cloudinaryUrl: string;
    title: boolean;

    constructor(id: string, url: string, title: boolean) {
        this.cloudinaryId = id;
        this.cloudinaryUrl = url;
        this.title = title;
    }
}
export class ImageDTO {
    cloudinaryId: string;
    cloudinaryUrl: string;
    width: number;
    height: number;
    title: boolean;

    constructor(id: string, url: string, width: number, height: number, title: boolean) {
        this.cloudinaryId = id;
        this.cloudinaryUrl = url;
        this.width = width;
        this.height = height;
        this.title = title;
    }
}
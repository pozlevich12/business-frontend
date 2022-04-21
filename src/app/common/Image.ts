import { SafeUrl } from "@angular/platform-browser";

export class Image {
    file: File | undefined;
    localUrl: SafeUrl | undefined;
    cloudinaryId: string | undefined;
    cloudinaryUrl: string | undefined;
    smallUrl: string | undefined;
    width: number | undefined;
    height: number | undefined;
    title: boolean | undefined;
}
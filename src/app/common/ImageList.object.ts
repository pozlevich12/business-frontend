import { FileHandle } from "./FileHandle.object";

export class ImageList {
    images: FileHandle[] = [];
    hasUploadError: boolean | undefined;
    titleImg: number = 0;
    loadingProcess: boolean | undefined;
}

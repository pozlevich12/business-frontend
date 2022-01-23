import { SafeUrl } from "@angular/platform-browser";

export class FileHandle{
  file: File | undefined;
  url: string | undefined;
  localUrl: SafeUrl | undefined;
  width: number | undefined;
  height: number | undefined;
  id: string | undefined;
}

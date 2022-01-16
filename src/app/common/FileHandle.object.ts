import { SafeUrl } from "@angular/platform-browser";

export class FileHandle{
  file: File | undefined;
  url: string | undefined;
  localUrl: SafeUrl | undefined;
  id: string | undefined;
}

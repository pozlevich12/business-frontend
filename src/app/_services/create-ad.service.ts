import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CreateAdService {

  constructor(private sanitizer: DomSanitizer) { }

  filesDropped(files: FileList): any[] {
    let uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        uploadedFiles.push({
          file,
          url
        });
      }
    }
    return uploadedFiles;
  }
}

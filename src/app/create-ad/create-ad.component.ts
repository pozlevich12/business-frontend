import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { FileHandle } from '../common/FileHandle.object';
import { CreateAdService } from '../_services/create-ad.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {
  uploadedFiles: FileHandle[] = [];
  constructor(private appComponent: AppComponent, private createAdService: CreateAdService, private changeDetection: ChangeDetectorRef) {
    this.appComponent.components = [false, true];
  }

  ngOnInit(): void {
  }

  setTitleImage(index: number) {
    for(let i = 0; i < this.uploadedFiles.length; i++) {
      if(i === index) {
        this.uploadedFiles[i].title = true;
      } else {
        this.uploadedFiles[i].title = false;
      }
    }
  }

  filesDropped(event: Event) {
    const input = event.target as HTMLInputElement;
    this.createAdService.filesDropped(input.files!).forEach(file => {
      this.uploadedFiles.push(file);
    });
  }

  deleteImg(deleteFile: FileHandle) {
    let title = false;
    if(deleteFile.title) {
      title = true;
    }
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== deleteFile);
    if(title && this.uploadedFiles.length > 0) {
      this.uploadedFiles[0].title = true;
    }
  }
}

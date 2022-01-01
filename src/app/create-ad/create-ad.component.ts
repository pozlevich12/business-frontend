import { Component, OnInit } from '@angular/core';
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
  indexTitleImg: number = 0;

  constructor(private appComponent: AppComponent, private createAdService: CreateAdService) {
    this.appComponent.components = [false, true];
  }

  ngOnInit(): void {
  }

  setTitleImage(index: number) {
    this.indexTitleImg = index;
  }

  filesDropped(event: Event) {
    const input = event.target as HTMLInputElement;
    this.createAdService.filesDropped(input.files!).forEach(file => {
      this.uploadedFiles.push(file);
    });
  }

  deleteImg(index: number) {
    if (this.indexTitleImg === index) {
      this.indexTitleImg = 0;
    } else if (index < this.indexTitleImg) {
      this.indexTitleImg--;
    }
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== this.uploadedFiles[index]);
  }
}

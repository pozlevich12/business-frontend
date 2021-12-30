import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  constructor(private appComponent: AppComponent, private createAdService: CreateAdService) {
    this.appComponent.components = [false, true];
  }

  ngOnInit(): void {
  }

  filesDropped(event: Event) {
    const input = event.target as HTMLInputElement;
    this.createAdService.filesDropped(input.files!).forEach(file => {
      this.uploadedFiles.push(file);
    });
  }
}

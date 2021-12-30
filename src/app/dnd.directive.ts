import { Directive, HostBinding, HostListener } from '@angular/core';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { CreateAdService } from './_services/create-ad.service';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @HostBinding('style.background') public background = 'white';
  constructor(private createAdService: CreateAdService, private createAdComponent: CreateAdComponent) { }

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    console.log('over');
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#F8F8F8';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'white';
  }

  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'white';
    this.createAdService.filesDropped(evt.dataTransfer!.files).forEach(file => {
      this.createAdComponent.uploadedFiles.push(file);
    });
  }
}
import { Directive, HostBinding, HostListener } from '@angular/core';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { CreateAdService } from './_services/create-ad/create-ad.service';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @HostBinding('style.background') public background = 'white';
  constructor(private createAdComponent: CreateAdComponent, private createAdService: CreateAdService) { }

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
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
    if (!this.createAdComponent.process) {
      const filesDropped = evt.dataTransfer!.files;
      this.createAdService.filesDropped(filesDropped, this.createAdComponent.ad.imgList);
    }
  }
}
import { Directive, HostBinding, HostListener } from '@angular/core';
import { AdEditComponent } from '../../app/ad-edit/ad-edit.component';
import { AdEditService } from '../../app/_services/ad/ad-edit.service';

@Directive({
    selector: '[appDndEditAd]'
})

export class DndDirectiveEditAd {
    @HostBinding('style.background') public background = 'white';
    constructor(private adEditComponent: AdEditComponent, private adEditService: AdEditService) { }

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
        if (!this.adEditComponent.process) {
            const filesDropped = evt.dataTransfer!.files;
            this.adEditService.filesDropped(filesDropped, this.adEditComponent.ad.imgList);
        }
    }
}
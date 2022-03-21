import { Directive, ElementRef, HostListener } from '@angular/core';
import { AppComponent } from './app.component';

@Directive({
  selector: '[appHoverClass]'
})
export class HoverClassDirective {

  constructor(private appComponent: AppComponent, private elementRef: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.style.setProperty('background-color', this.appComponent.theme.mainColor);
 }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.setProperty('background-color', this.appComponent.theme.backgroundColor);
  }
}

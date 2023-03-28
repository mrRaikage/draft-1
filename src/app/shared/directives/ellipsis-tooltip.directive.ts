import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEllipsisTooltip]'
})
export class EllipsisTooltipDirective implements AfterViewInit {
  domElement: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.domElement = this.elementRef.nativeElement;
    const style = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
    Object.keys(style).forEach(element => {
      this.renderer.setStyle(this.domElement, `${element}`, style[element]);
    });
  }

  ngAfterViewInit(): void {
    this.renderer.setProperty(this.domElement, 'scrollTop', 1);
    this.setToolTip();
  }

  @HostListener('window:resize', ['$event.target'])
  setToolTip(): void {
    this.domElement.offsetWidth < this.domElement.scrollWidth
      ? this.renderer.setAttribute(this.domElement, 'title', this.domElement.textContent)
      : this.renderer.removeAttribute(this.domElement, 'title');
  }
}

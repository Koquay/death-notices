import { Directive, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]',
  standalone: true
})
export class AutoResizeTextareaDirective {
  private textarea: HTMLTextAreaElement;

  constructor(private el: ElementRef<HTMLTextAreaElement>) {
    this.textarea = this.el.nativeElement;

  }

  ngAfterViewInit() {
    // Auto-resize once binding is applied
    this.resize();
  }

  resize() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = this.textarea.scrollHeight + 'px';
  }
}

import { Directive, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
  standalone: true     // ← make it standalone
})
export class AutoResizeDirective implements AfterViewInit, OnDestroy {
  private textarea: HTMLTextAreaElement;
  private mo?: MutationObserver;

  constructor(private el: ElementRef<HTMLTextAreaElement>) {
    this.textarea = this.el.nativeElement;
    console.log("AutoResizeDirective initialized", this.textarea);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.resize());
    this.mo = new MutationObserver(() => this.resize());
    this.mo.observe(this.textarea, { attributes: true, childList: true });
  }

  @HostListener('input')
  onInput() { this.resize(); }

  resize() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = this.textarea.scrollHeight + 'px';
  }

  ngOnDestroy(): void { this.mo?.disconnect(); }
}


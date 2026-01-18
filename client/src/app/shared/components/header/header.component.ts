import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() openEditNoticeModal = new EventEmitter<void>();
  @Output() openEditMemoriamModal = new EventEmitter<void>();
  @Output() openContactUsModal = new EventEmitter<void>();

  currentUrl = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.urlAfterRedirects;
      });
  }

  onEditNoticeClick() {
    this.openEditNoticeModal.emit();
  }

  onEditMemoriamClick() {
    this.openEditMemoriamModal.emit();
  }

  onContactUsClick() {
    this.openContactUsModal.emit();
  }

  isEditNoticeActive(): boolean {
    return this.currentUrl.startsWith('/edit-notice');
  }

  isEditMemoriamActive(): boolean {
    return this.currentUrl.startsWith('/edit-memoriam');
  }

  isContactUsActive(): boolean {
    return this.currentUrl.startsWith('/contact-us');
  }
}




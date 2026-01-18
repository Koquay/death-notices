import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { EditNoticeModalComponent } from './edit-notice/edit-notice-modal/edit-notice-modal.component';
import { MemoriamEditModalComponent } from './memoriam/memoriam-edit-modal/memoriam-edit-modal.component';
import { AppService } from './app.service';
import { ContactUsComponent } from './contact-us/contact-us.component';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    EditNoticeModalComponent,
    MemoriamEditModalComponent,
    ContactUsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';

  private appService = inject(AppService);

  constructor() {
    this.appService.restoreStateFromLocalStorage();
  }

  showEditNoticeModal() {
    console.log('AppComponent.showEditNoticeModal() called')
    const modalElement = document.getElementById('editNoticeModal');
    console.log('AppComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showEditMemoriamModal() {
    console.log('AppComponent.showEditMemoriamModal() called')
    const modalElement = document.getElementById('editMemoriamModal');
    console.log('AppComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showContactUsModal() {
    console.log('AppComponent.showContactUsModal() called')
    const modalElement = document.getElementById('contactUsModal');
    console.log('AppComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}

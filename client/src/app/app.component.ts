import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { EditNoticeModalComponent } from './edit-notice/edit-notice-modal/edit-notice-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    EditNoticeModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';

  showEditNoticeModal() {
    console.log('AppComponent.showEditNoticeModal() called')
    const modalElement = document.getElementById('editNoticeModal');
    console.log('AppComponent.modalElement', modalElement)
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}

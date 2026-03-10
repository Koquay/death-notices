import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditNoticeService } from '../edit-notice.service';
import { Router } from '@angular/router';
import { ToastUtils } from '../../shared/utils/toastUtils';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-notice-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-notice-modal.component.html',
  styleUrl: './edit-notice-modal.component.scss'
})
export class EditNoticeModalComponent {
  private router = inject(Router);
  public editNoticeService = inject(EditNoticeService);
  private toastrUtils = inject(ToastUtils);
  public noticeNumber: string = '7563-2475-1530';

  public getNotice() {
    this.router.navigate(['/edit-notice', this.noticeNumber]);
    this.closeModal('editNoticeModal');
  }

  private closeModal = (modalId: string) => {
    console.log('closeModal called')
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}

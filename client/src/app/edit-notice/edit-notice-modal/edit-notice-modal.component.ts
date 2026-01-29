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
  public noticeNumber: string = '1646-6706-9291';

  public getNotice() {
    this.editNoticeService.getNotice(this.noticeNumber).subscribe({
      next: () => {
        this.router.navigate(['/edit-notice']);
        this.closeModal('editNoticeModal');
      },
      error: (error) => {
        console.log('error', error)
        console.log('error', error.error.message)
        let message;
        if (error.error.expired) {
          message = error.error.message;
        } else {
          message = `Notice for ${this.noticeNumber} not found.`;
        }
        this.toastrUtils.show(
          'error',
          `${message}`,
          'Notice Error'
        );
      }
    });
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

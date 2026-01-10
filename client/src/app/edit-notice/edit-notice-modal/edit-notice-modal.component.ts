import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditNoticeService } from '../edit-notice.service';
import { Router } from '@angular/router';

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
  public noticeNumber: string = '1646-6706-9291';

  public getNotice() {
    this.editNoticeService.getNotice(this.noticeNumber).subscribe({
      next: () => {
        this.router.navigate(['/edit-notice']);
        this.closeModal('editNoticeModal');
        // this.authService.emitSignInSuccess();
        // this.toastr.success('Signed in successfully', 'Welcome');
      },
      error: () => {
        // this.toastr.error('Sign-in failed. Please try again.', 'Error');
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

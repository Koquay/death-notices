import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ToastUtils } from '../../shared/utils/toastUtils';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';
import { Router } from '@angular/router';
import { ModalUtil } from '../../shared/utils/modal-util';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemoriamEditService {
  private router = inject(Router);
  public memoriamEntryModel = inject(NoticeEntryModel);

  // private apiUrl = '/api/notices';
  private apiUrl = '/api/memoriams';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);

  public submitMemoriam = () => {
    const fd = new FormData();

    fd.append(
      'memoriam',
      JSON.stringify({
        name: this.memoriamEntryModel.name,
        announcement: this.memoriamEntryModel.announcement,
      })
    );

    console.log(
      'this.memoriamEntryModel.imageFile',
      this.memoriamEntryModel.imageFile
    );

    if (this.memoriamEntryModel.imageFile instanceof File) {
      fd.append('image', this.memoriamEntryModel.imageFile);
      console.log(
        'Appending image file to FormData:',
        this.memoriamEntryModel.imageFile
      );
    }

    console.log('FormData being sent:');
    fd.forEach((value, key) => console.log(key, value));

    this.httpClient
      .put<NoticeEntryModel>(
        `${this.apiUrl}/${this.memoriamEntryModel._id}`,
        fd
      )
      .subscribe({
        next: (memoriam) => {
          Object.assign(this.memoriamEntryModel, memoriam);
          this.memoriamEntryModel.editImageMode = false;
          console.log('Memoriam submitted successfully:', memoriam);
          this.toastrUtils.show(
            'success',
            'Memoriam submitted successfully.',
            'Memoriam Success'
          );
        },
        error: (error) => {
          console.error('Error submitting memoriam:', error);
          this.toastrUtils.show(
            'error',
            error.message || 'An error occurred while submitting the memoriam.',
            'Memoriam Error'
          );
        },
      });
  };

  getMemoriam = (memoriamId: string) => {
    this.httpClient
      .get<NoticeEntryModel>(`${this.apiUrl}/${memoriamId}`)
      .subscribe({
        next: (memoriam) => {
          console.log('Memoriam memoriam:', memoriam);
          Object.assign(this.memoriamEntryModel, memoriam);
        },
        error: (error) => {
          console.log('error', error)
          this.toastrUtils.show(
            'error',
            error.message || 'An error occurred while fetching memoriam.',
            'Get Memoriam Error'
          );
          throw error;
        },
      })
  };



  getMemoriamByNo = (memoriamNo: string) => {
    this.httpClient
      .get<NoticeEntryModel>(`${this.apiUrl}/${memoriamNo}/2`).subscribe({
        next: (memoriam) => {
          console.log('Memoriam memoriam:', memoriam);

          if (memoriam) {
            Object.assign(this.memoriamEntryModel, memoriam);
            console.log(
              'Memoriam this.memoriamEntryModel:',
              this.memoriamEntryModel
            );
            this.router.navigate(['/edit-memoriam']);
            ModalUtil.closeModal('editMemoriamModal');
          } else {
            this.toastrUtils.show(
              'error',
              `Memoriam number ${memoriamNo} not found.`,
              'Memoriam Error'
            );
          }
        },
        error: (error) => {
          console.log('error', error)
          this.toastrUtils.show(
            'error',
            error.message || 'An error occurred while fetching memoriam.',
            'Get Memoriam Error'
          );
          throw error;
        },
      });
  }
}

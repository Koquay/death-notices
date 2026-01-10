import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';
import { catchError } from 'rxjs';
import { ToastUtils } from '../../shared/utils/toastUtils';

@Injectable({
  providedIn: 'root'
})
export class MemoriamViewService {
  public memoriamViewSignal = signal<{
    memoriam: NoticeEntryModel;
  }>({ memoriam: new NoticeEntryModel() });

  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  private apiUrl = '/api/memoriams';

  getMemoriam = (memoriamId: string) => {
    this.httpClient.get<NoticeEntryModel>(`${this.apiUrl}/${memoriamId}`).subscribe(memoriam => {
      console.log("Memoriam memoriam:", memoriam);
      this.memoriamViewSignal.set({ memoriam: memoriam });
      console.log('memoriamViewSignal:', this.memoriamViewSignal().memoriam);
    }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while getting memoriam.',
          'Get Memoriam Error'
        );
        throw error;
      })
  }
}

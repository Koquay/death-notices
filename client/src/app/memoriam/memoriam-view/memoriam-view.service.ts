import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';

@Injectable({
  providedIn: 'root'
})
export class MemoriamViewService {
  public memoriamViewSignal = signal<{
    memoriam: NoticeEntryModel;
  }>({ memoriam: new NoticeEntryModel() });

  private httpClient = inject(HttpClient);
  private apiUrl = '/api/memoriams';

  getMemoriam = (memoriamId: string) => {
    this.httpClient.get<NoticeEntryModel>(`${this.apiUrl}/${memoriamId}`).subscribe(memoriam => {
      console.log("Memoriam memoriam:", memoriam);
      this.memoriamViewSignal.set({ memoriam: memoriam });
      console.log('memoriamViewSignal:', this.memoriamViewSignal().memoriam);
    })
  }
}

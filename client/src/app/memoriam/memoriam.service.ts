import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { ToastUtils } from '../shared/utils/toastUtils';

@Injectable({
  providedIn: 'root'
})
export class MemoriamService {

  public memoriamsSignal = signal<{
    memoriams: NoticeEntryModel[];
  }>({ memoriams: [] });

  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  private memoriamUrl = '/api/memoriams';

  public getMemoriams = () => {
    return this.httpClient.get<NoticeEntryModel[]>(this.memoriamUrl).pipe(
      tap((memoriamsData) => {
        this.memoriamsSignal.set({ memoriams: memoriamsData });
        console.log('memoriamsSignal:', this.memoriamsSignal().memoriams);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while fetching memoriams.',
          'Get Memoriams Error'
        );
        throw error;
      })

    )
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';

@Injectable({
  providedIn: 'root'
})
export class MemoriamService {

  public memoriamsSignal = signal<{
    memoriams: NoticeEntryModel[];
  }>({ memoriams: [] });

  private httpClient = inject(HttpClient);
  private memoriamUrl = '/api/notices/memoriam';

  public getMemoriams = () => {
    return this.httpClient.get<NoticeEntryModel[]>(this.memoriamUrl).pipe(
      tap((memoriamsData) => {
        this.memoriamsSignal.set({ memoriams: memoriamsData });
        console.log('memoriamsSignal:', this.memoriamsSignal().memoriams);
      }),

    )
  }
}

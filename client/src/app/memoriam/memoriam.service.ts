import { inject, Injectable, signal } from '@angular/core';
import { NoticesModel } from '../home/home.component';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoriamService {

  public memoriamsSignal = signal<{
    memoriams: NoticesModel[];
  }>({ memoriams: [] });

  private httpClient = inject(HttpClient);
  private memoriamUrl = '/api/notices/memoriam';

  public getMemoriams = () => {
    return this.httpClient.get<NoticesModel[]>(this.memoriamUrl).pipe(
      tap((memoriamsData) => {
        this.memoriamsSignal.set({ memoriams: memoriamsData });
        console.log('memoriamsSignal:', this.memoriamsSignal().memoriams);
      }),

    )
  }
}

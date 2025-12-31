import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';

@Injectable({
  providedIn: 'root'
})
export class MemoriamSearchService {
  public memoriamSignal = signal<NoticeEntryModel[]>([]);

  private searchUrl = '/api/notices/search/memoriams/name/1';
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService)

  public searchForMemoriams = (searchField: string) => {

    const params = new HttpParams({
      fromObject: { searchField },
    });

    return this.httpClient.get<NoticeEntryModel[]>(this.searchUrl, { params }).pipe(
      tap(memoriams => {
        console.log('SearchService.memoriams', memoriams)
        this.memoriamSignal.set([...memoriams]);
        console.log('SearchService.memoriamSignal', this.memoriamSignal())
        // this.router.navigate(['/notice-search']);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastr.error(error.message, 'Memoriam Search',
          // { positionClass: getScrollPos() }
        );
        throw error;
      })
    ).subscribe()
  }
}

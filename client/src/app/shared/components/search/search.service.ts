import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { NoticeEntryModel } from '../../../notice-entry/notice-entry.model';
import { ToastUtils } from '../../utils/toastUtils';
// import { NoticesModel } from '../../../death-notice-gallery/death-notice-gallery.component';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchSignal = signal<NoticeEntryModel[]>([]);
  private searchUrl = '/api/notices/search/notices/name/1';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);

  public searchForNotices = (searchField: string) => {

    const params = new HttpParams({
      fromObject: { searchField },
    });

    return this.httpClient.get<NoticeEntryModel[]>(this.searchUrl, { params }).pipe(
      tap(notices => {
        console.log('SearchService.notices', notices)
        this.searchSignal.set([...notices]);
        console.log('SearchService.searchSignal', this.searchSignal())
        // this.router.navigate(['/notice-search']);
      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while searching for notices.',
          'Search Notices Error'
        );
        throw error;
      })
    ).subscribe()
  }
}

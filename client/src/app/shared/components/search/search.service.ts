import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NoticeEntryModel } from '../../../notice-entry/notice-entry.model';
// import { NoticesModel } from '../../../death-notice-gallery/death-notice-gallery.component';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchSignal = signal<NoticeEntryModel[]>([]);
  private searchUrl = '/api/notices/search/notices/name/1';
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService)

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
        this.toastr.error(error.message, 'Save Cart to Server',
          // { positionClass: getScrollPos() }
        );
        throw error;
      })
    ).subscribe()
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { ToastUtils } from '../shared/utils/toastUtils';

@Injectable({
  providedIn: 'root'
})
export class DeathNoticeGalleryService {

  public noticesSignal = signal<{
    notices: NoticeEntryModel[];
  }>({ notices: [] });
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  private noticesUrl = '/api/notices';

  public getNotices = () => {
    return this.httpClient.get<NoticeEntryModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while fetching notices.',
          'Get Notices Error'
        );
        throw error;
      })
    )
  }

  public getSelectedNotice = (noticeId: string) => {
    const selectedNotice = this.noticesSignal().notices.find(notice => notice._id === noticeId);

    persistStateToLocalStorage({ selectedNotice: selectedNotice });
    return selectedNotice;
  }

  public getNotice = (noticeNo: string) => {
    return this.httpClient.get<NoticeEntryModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while fetching notice.',
          'Get Notice Error'
        );
        throw error;
      })

    )
  }
}

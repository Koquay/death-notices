import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';

@Injectable({
  providedIn: 'root'
})
export class DeathNoticeGalleryService {

  public noticesSignal = signal<{
    notices: NoticeEntryModel[];
  }>({ notices: [] });
  private httpClient = inject(HttpClient);
  private noticesUrl = '/api/notices';

  public getNotices = () => {
    return this.httpClient.get<NoticeEntryModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),

    )
  }

  public getNoticeById = (noticeId: string) => {
    const noticeById = this.noticesSignal().notices.find(notice => notice._id === noticeId);

    persistStateToLocalStorage({ noticeById: noticeById });
    return noticeById;
  }

  public getNotice = (noticeNo: string) => {
    return this.httpClient.get<NoticeEntryModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),

    )
  }
}

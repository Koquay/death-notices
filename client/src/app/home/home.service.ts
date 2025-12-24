import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { NoticesModel } from './home.component';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public noticesSignal = signal<{
    notices: NoticesModel[];
  }>({ notices: [] });
  private httpClient = inject(HttpClient);
  private noticesUrl = '/api/notices';

  public getNotices = () => {
    return this.httpClient.get<NoticesModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),

    )
  }

  public getNoticeById = (noticeId: string) => {
    return this.noticesSignal().notices.find(notice => notice._id === noticeId);
  }

  public getNotice = (noticeNo: string) => {
    return this.httpClient.get<NoticesModel[]>(this.noticesUrl).pipe(
      tap((noticesData) => {
        this.noticesSignal.set({ notices: noticesData });
        console.log('noticesSignal:', this.noticesSignal());
      }),

    )
  }
}

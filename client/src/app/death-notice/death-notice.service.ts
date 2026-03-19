import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastUtils } from '../shared/utils/toastUtils';
import { FormatDateTimeUtils } from '../shared/utils/formatDateTimeUtil';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeathNoticeService {
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  public NoticeEntryModel = inject(NoticeEntryModel);
  private formatDateTimeUtils = inject(FormatDateTimeUtils);;

  private noticesUrl = '/api/notices';

  constructor() { }

  public getNoticeById = (noticeId: string) => {
    const params = new HttpParams({
      fromObject: { noticeId },
    });

    return this.httpClient.get<NoticeEntryModel>(`${this.noticesUrl}/notice/id/${noticeId}`).pipe(
      tap((NoticeEntryModel) => {
        NoticeEntryModel.birth_date_str = this.formatDateTimeUtils.formatDateForInput(NoticeEntryModel.birth_date);
        NoticeEntryModel.death_date_str = this.formatDateTimeUtils.formatDateForInput(NoticeEntryModel.death_date);

        for (let i = 0; i < NoticeEntryModel.events.length; i++) {
          NoticeEntryModel.events[i].date_str = this.formatDateTimeUtils.formatDateForInput(NoticeEntryModel.events[i].date as Date);

          NoticeEntryModel.events[i].time =
            this.formatDateTimeUtils.formatTimeForInput(NoticeEntryModel.events[i].time);
        }


        Object.assign(this.NoticeEntryModel, NoticeEntryModel);
        console.log('EditNoticeService.NoticeEntryModel:', this.NoticeEntryModel);
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

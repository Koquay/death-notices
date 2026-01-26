import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { ToastUtils } from '../shared/utils/toastUtils';
import { DeathNoticeGalleryOptions } from './death-notice-gallery.options';

@Injectable({
  providedIn: 'root'
})
export class DeathNoticeGalleryService {

  public noticesSignal = signal<{
    notices: NoticeEntryModel[];
  }>({ notices: [] });

  public deathNOticeGallerySignal = signal<DeathNoticeGalleryOptions>(new DeathNoticeGalleryOptions());

  private httpClient = inject(HttpClient);
  private deathNoticeGalleryOptions = inject(DeathNoticeGalleryOptions);
  private toastrUtils = inject(ToastUtils);
  private noticesUrl = '/api/notices';
  static YEAR: string = '2026';

  public getNotices = () => {
    const optionsStr = JSON.stringify(this.deathNoticeGalleryOptions);

    const params = new HttpParams({
      fromObject: { options: optionsStr },
    });

    return this.httpClient
      .get<{ data: NoticeEntryModel[]; totalCount: number }>(
        this.noticesUrl,
        { params }
      )
      .pipe(
        tap((response) => {
          this.noticesSignal.set({ notices: response.data });
          console.log('noticesSignal:', this.noticesSignal());
          console.log('totalCount', response.totalCount)
          this.deathNoticeGalleryOptions.totalCount = response.totalCount;
          this.deathNOticeGallerySignal.set({ ...this.deathNOticeGallerySignal(), totalCount: response.totalCount })
          console.log('deathNOticeGallerySignal:', this.deathNOticeGallerySignal());
          window.scrollTo({ top: 0, behavior: 'smooth' });

        }),
        map((response) => response.data) // ✅ RETURN ARRAY ONLY
      );
  };


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

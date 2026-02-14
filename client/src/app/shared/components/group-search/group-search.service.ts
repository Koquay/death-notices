import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../../interfaces/groups.interface';
import { catchError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastUtils } from '../../utils/toastUtils';
import { NoticeEntryModel } from '../../../notice-entry/notice-entry.model';

@Injectable({
  providedIn: 'root'
})
export class GroupSearchService {
  public groupSearchSignal = signal<NoticeEntryModel[]>([]);
  private apiUrl = '/api/notices';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);;

  public getGroups = () => {
    return this.httpClient.get<Group[]>(`${this.apiUrl}/groups`).pipe(
      tap(groups => {

      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while getting groups.',
          'Get Groups Error'
        );
        throw error;
      })
    )
  }


}

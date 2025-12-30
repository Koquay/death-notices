import { inject, Injectable, signal } from '@angular/core';
import { Group } from '../../interfaces/groups.interface';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastUtils } from '../../utils/toastUtils';
import { NoticesModel } from '../../../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class GroupSearchService {
  public groupSearchSignal = signal<NoticesModel[]>([]);
  private apiUrl = '/api/notices';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);;

  public getGroups = () => {
    return this.httpClient.get<Group[]>(`${this.apiUrl}/groups`).pipe(
      tap(groups => {

      })
    )
  }

  public getNoticesForGroup = (groupId: string) => {
    return this.httpClient.get<NoticesModel[]>(`${this.apiUrl}/groups/${groupId}`).pipe(
      tap(notices => {
        this.groupSearchSignal.set([...notices]);
      })
    )
  }
}

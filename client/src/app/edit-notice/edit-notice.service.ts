import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { EditNoticeModel } from './edit-notice.model';
import { Group } from '../shared/interfaces/groups.interface';
import { ToastUtils } from '../shared/utils/toastUtils';
import { FormatDateTimeUtils } from '../shared/utils/formatDateTimeUtil';

@Injectable({
  providedIn: 'root'
})
export class EditNoticeService {
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  public editNoticeModel = inject(EditNoticeModel);
  private formatDateTimeUtils = inject(FormatDateTimeUtils);;

  private noticesUrl = '/api/notices';

  public getNotice = (noticeNo: string) => {
    const params = new HttpParams({
      fromObject: { noticeNo },
    });

    return this.httpClient.get<EditNoticeModel>(`${this.noticesUrl}/notice/no/${noticeNo}`).pipe(
      tap((editNoticeModel) => {
        editNoticeModel.birth_date_str = this.formatDateTimeUtils.formatDateForInput(editNoticeModel.birth_date);
        editNoticeModel.death_date_str = this.formatDateTimeUtils.formatDateForInput(editNoticeModel.death_date);

        for (let i = 0; i < editNoticeModel.events.length; i++) {
          editNoticeModel.events[i].date_str = this.formatDateTimeUtils.formatDateForInput(editNoticeModel.events[i].date as Date);

          editNoticeModel.events[i].time =
            this.formatDateTimeUtils.formatTimeForInput(editNoticeModel.events[i].time);
        }


        Object.assign(this.editNoticeModel, editNoticeModel);
        console.log('EditNoticeService.editNoticeModel:', this.editNoticeModel);
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

  public submitNoticeEdits = (editNoticeModel: EditNoticeModel) => {
    const fd = new FormData();

    fd.append(
      'notice',
      JSON.stringify({
        name: editNoticeModel.name,
        birth_date: editNoticeModel.birth_date,
        death_date: editNoticeModel.death_date,
        announcement: editNoticeModel.announcement,
        additionalInformation: editNoticeModel.additionalInformation,
        contacts: editNoticeModel.contacts,
        events: editNoticeModel.events,
        groups: editNoticeModel.groups,
      })
    );

    console.log('editNoticeModel.imageFile', editNoticeModel.imageFile);

    if (editNoticeModel.imageFile instanceof File) {
      fd.append('image', editNoticeModel.imageFile);
      console.log('Appending image file to FormData:', editNoticeModel.imageFile);
    }

    this.httpClient.put<EditNoticeModel>(
      `${this.noticesUrl}/${editNoticeModel._id}`,
      fd
    ).pipe(
      tap((editedNotice) => {
        console.log('Edited notice response:', editedNotice);
        Object.assign(this.editNoticeModel, editedNotice);
        this.editNoticeModel.editImageMode = false;
        this.toastrUtils.show(
          'success',
          'Notice updated successfully.',
          'Notice Update'
        );
      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while updating notice.',
          'Edit Notice Error'
        );
        throw error;
      })
    ).subscribe();
  };

  public addNewGroup = (group: Group) => {
    return this.httpClient.post<Group[]>(`${this.noticesUrl}/group`, group).pipe(
      tap(groups => {

      }),
      catchError(error => {
        console.log('error', error)
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while adding new group.',
          'Add Group Error'
        );
        throw error;
      })
    )
  }

  public getGroups = () => {
    return this.httpClient.get<Group[]>(`${this.noticesUrl}/groups`).pipe(
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

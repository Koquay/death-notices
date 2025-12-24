import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { EditNoticeModel } from './edit-notice.model';

@Injectable({
  providedIn: 'root'
})
export class EditNoticeService {
  // public editNoticeSignal = signal<{
  //   editNoticeModel: EditNoticeModel;
  // }>({ editNoticeModel: new EditNoticeModel() });

  private httpClient = inject(HttpClient);
  public editNoticeModel = inject(EditNoticeModel);

  private noticesUrl = '/api/notices';

  public getNotice = (noticeNo: string) => {
    const params = new HttpParams({
      fromObject: { noticeNo },
    });

    return this.httpClient.get<EditNoticeModel>(`${this.noticesUrl}/notice/no/${noticeNo}`).pipe(
      tap((editNoticeModel) => {
        editNoticeModel.birth_date_str = this.formatDateForInput(editNoticeModel.birth_date);
        editNoticeModel.death_date_str = this.formatDateForInput(editNoticeModel.death_date);

        for (let i = 0; i < editNoticeModel.events.length; i++) {
          editNoticeModel.events[i].date_str = this.formatDateForInput(editNoticeModel.events[i].date as Date);

          editNoticeModel.events[i].time =
            this.formatTimeForInput(editNoticeModel.events[i].time);
        }


        Object.assign(this.editNoticeModel, editNoticeModel);
        console.log('EditNoticeService.editNoticeModel:', this.editNoticeModel);
      }),

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
      })
    );

    console.log('editNoticeModel.imageFile', editNoticeModel.imageFile);

    if (editNoticeModel.imageFile instanceof File) {
      fd.append('image', editNoticeModel.imageFile);
      console.log('Appending image file to FormData:', editNoticeModel.imageFile);
    }

    this.editNoticeModel.editImageMode = false;

    this.httpClient.put<EditNoticeModel>(
      `${this.noticesUrl}/${editNoticeModel._id}`,
      fd
    ).pipe(
      tap((editedNotice) => {
        console.log('Edited notice response:', editedNotice);
        Object.assign(this.editNoticeModel, editedNotice);
      })
    ).subscribe();
  };

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const date_str = `${year}-${month}-${day}`;
    console.log('formatDateForInput.date', date)
    console.log('formatDateForInput.date_str', date_str)
    return date_str;
  }

  formatTimeForInput(time: string | Date | null): string {
    if (!time) return '';

    // If already HH:mm, return as-is
    if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    const d = new Date(time);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}

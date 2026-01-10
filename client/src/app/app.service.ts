import { inject, Injectable, signal } from '@angular/core';
import { NoticeEntryModel } from './notice-entry/notice-entry.model';
import { EditNoticeModel } from './edit-notice/edit-notice.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private noticeEntryModel = inject(NoticeEntryModel);
  private editNoticeModel = inject(EditNoticeModel);
  private memoriamEntryModel = inject(NoticeEntryModel);


  public restoreStateFromLocalStorage = () => {
    const stored = localStorage.getItem("deathNotice");
    const deathNotice = stored ? JSON.parse(stored) : null;

    Object.assign(this.noticeEntryModel, deathNotice?.noticeEntryModel ?? {});
    Object.assign(this.editNoticeModel, deathNotice?.editNoticeModel ?? {});
    Object.assign(this.memoriamEntryModel, deathNotice?.memoriamEntryModel ?? {});

  };
}

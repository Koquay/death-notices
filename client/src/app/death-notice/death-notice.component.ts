import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AutoResizeTextareaDirective } from '../shared/directives/auto-resize-textarea.directive';
import { ToAmPmPipe } from '../shared/pipes/to-am-pm.pipe ';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { DeathNoticeGalleryService } from '../death-notice-gallery/death-notice-gallery.service';
import { FormsModule } from '@angular/forms';
import { FormatDateTimeUtils } from '../shared/utils/formatDateTimeUtil';

@Component({
  selector: 'app-death-notice',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    AutoResizeTextareaDirective,
    ToAmPmPipe
  ],
  templateUrl: './death-notice.component.html',
  styleUrl: './death-notice.component.scss'
})
export class DeathNoticeComponent {
  private activatedRoute = inject(ActivatedRoute);
  private noticesService = inject(DeathNoticeGalleryService);
  private formatDateTimeUtils = inject(FormatDateTimeUtils);
  public notice: NoticeEntryModel | undefined;
  public apiUrl = '/api/notices';

  ngOnInit() {
    this.getDeathNotice();
  }

  private getDeathNotice = () => {
    const noticeId = this.activatedRoute.snapshot.paramMap.get('noticeId') as string || "";
    console.log("DeathNoticeComponent.noticeId", noticeId);
    this.notice = this.noticesService.getSelectedNotice(noticeId);
    console.log("DeathNoticeComponent.notice", this.notice);

    if (this.notice) {
      for (let i = 0; i < this.notice.events.length; i++) {
        this.notice.events[i].date_str = this.formatDateTimeUtils.formatDateForDisplay(this.notice.events[i].date as Date);

        // editNoticeModel.events[i].time =
        //   this.formatDateTimeUtils.formatTimeForInput(editNoticeModel.events[i].time);
      }

      if (!this.notice) {
        const storedData = localStorage.getItem('deathNotice');
        if (storedData) {
          const deathNotice = JSON.parse(storedData);
          this.notice = deathNotice?.selectedNotice;
        }
        console.log("DeathNoticeComponent.notice from localStorage", this.notice);
      }

    }
  }

}



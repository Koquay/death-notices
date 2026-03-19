import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AutoResizeTextareaDirective } from '../shared/directives/auto-resize-textarea.directive';
import { ToAmPmPipe } from '../shared/pipes/to-am-pm.pipe ';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { DeathNoticeGalleryService } from '../death-notice-gallery/death-notice-gallery.service';
import { FormsModule } from '@angular/forms';
import { FormatDateTimeUtils } from '../shared/utils/formatDateTimeUtil';
import { DeathNoticeService } from './death-notice.service';

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
  private noticesService = inject(DeathNoticeService);
  private formatDateTimeUtils = inject(FormatDateTimeUtils);
  public notice: NoticeEntryModel | undefined;
  public apiUrl = '/api/notices';

  ngOnInit() {
    this.getNoticeById();
  }

  private getNoticeById = () => {
    const noticeId = this.activatedRoute.snapshot.paramMap.get('noticeId') as string || "";
    console.log("DeathNoticeComponent.noticeId", noticeId);
    this.noticesService.getNoticeById(noticeId).subscribe((notice) => {
      this.notice = notice;

      if (this.notice) {
        for (let i = 0; i < this.notice.events.length; i++) {
          this.notice.events[i].date_str =
            this.formatDateTimeUtils.formatDateForDisplay(this.notice.events[i].date as Date);
        }
      }

      console.log("DeathNoticeComponent.notice", this.notice);

      if (!this.notice) {
        const storedData = localStorage.getItem('deathNotice');
        if (storedData) {
          const deathNotice = JSON.parse(storedData);
          this.notice = deathNotice?.selectedNotice;
        }
        console.log("DeathNoticeComponent.notice from localStorage", this.notice);
      }

    })

  }


  get imageUrl(): string | null {
    if (!this.notice?.imageId) return null;
    return `${this.apiUrl}/image/${this.notice.imageId}`;
  }

}



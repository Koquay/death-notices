import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AutoResizeTextareaDirective } from '../shared/directives/auto-resize-textarea.directive';
import { ToAmPmPipe } from '../shared/pipes/to-am-pm.pipe ';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { DeathNoticeGalleryService } from '../death-notice-gallery/death-notice-gallery.service';

@Component({
  selector: 'app-death-notice',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    AutoResizeTextareaDirective,
    ToAmPmPipe
  ],
  templateUrl: './death-notice.component.html',
  styleUrl: './death-notice.component.scss'
})
export class DeathNoticeComponent {
  private activatedRoute = inject(ActivatedRoute);
  private noticesService = inject(DeathNoticeGalleryService);
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

    if (!this.notice) {
      const storedData = localStorage.getItem('deathNotice');
      if (storedData) {
        const deathNotice = JSON.parse(storedData);
        this.notice = deathNotice?.selectedNotice;
        console.log("DeathNoticeComponent.notice from localStorage", this.notice);
      }

    }
  }

  formatDateForInput(date: string | Date | null): string {
    if (!date) return '';
    const date_str = new Date(date).toISOString().split('T')[0];
    console.log('formatDateForInput.date', date)
    console.log('formatDateForInput.date_str', date_str)
    return date_str;
  }
}



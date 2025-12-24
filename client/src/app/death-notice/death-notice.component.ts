import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home/home.service';
import { NoticesModel } from '../home/home.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AutoResizeTextareaDirective } from '../shared/directives/auto-resize-textarea.directive';
import { ToAmPmPipe } from '../shared/pipes/to-am-pm.pipe ';

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
  private noticesService = inject(HomeService);
  public notice: NoticesModel | undefined;
  public apiUrl = '/api/notices';

  ngOnInit() {
    this.getDeathNotice();
  }

  private getDeathNotice = () => {
    const noticeId = this.activatedRoute.snapshot.paramMap.get('noticeId') as string || "";
    console.log("DeathNoticeComponent.noticeId", noticeId);
    this.notice = this.noticesService.getNoticeById(noticeId);
    console.log("DeathNoticeComponent.notice", this.notice);
  }
}



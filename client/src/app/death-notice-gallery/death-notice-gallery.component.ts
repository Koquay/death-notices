import { Component, effect, inject } from '@angular/core';
import { SearchService } from '../shared/components/search/search.service';
import { GroupSearchService } from '../shared/components/group-search/group-search.service';
import { DeathNoticeGalleryService } from './death-notice-gallery.service';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchComponent } from '../shared/components/search/search.component';
import { GroupSearchComponent } from '../shared/components/group-search/group-search.component';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { YearSearchComponent } from '../shared/components/year-search/year-search.component';

@Component({
  selector: 'app-death-notice-gallery',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    DatePipe,
    SearchComponent,
    GroupSearchComponent,
    YearSearchComponent,
    PaginationComponent
  ],
  templateUrl: './death-notice-gallery.component.html',
  styleUrl: './death-notice-gallery.component.scss'
})
export class DeathNoticeGalleryComponent {
  private deathNoticeGalleryService = inject(DeathNoticeGalleryService);
  private searchService = inject(SearchService);
  private groupSearchService = inject(GroupSearchService);
  public notices: NoticeEntryModel[] = []
  public apiUrl = '/api/notices';

  noticeEffect = effect(() => {
    this.notices = this.deathNoticeGalleryService.noticesSignal().notices;
  });

  groupSearchEffect = effect(() => {
    this.notices = this.groupSearchService.groupSearchSignal();
  });



  ngOnInit() {
    this.deathNoticeGalleryService.getNotices().subscribe(notices => {
      this.notices = notices;
    })
  }


  searchEffect = effect(() => {
    this.notices = this.searchService.searchSignal();
  })



}



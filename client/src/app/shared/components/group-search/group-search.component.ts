import { Component, inject } from '@angular/core';
import { GroupSearchService } from './group-search.service';
import { Group } from '../../interfaces/groups.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeathNoticeGalleryService } from '../../../death-notice-gallery/death-notice-gallery.service';
import { DeathNoticeGalleryOptions } from '../../../death-notice-gallery/death-notice-gallery.options';

@Component({
  selector: 'app-group-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './group-search.component.html',
  styleUrl: './group-search.component.scss'
})
export class GroupSearchComponent {
  private groupSearchService = inject(GroupSearchService);
  private deathNoticeGalleryService = inject(DeathNoticeGalleryService);
  private deathNoticeGalleryOptions = inject(DeathNoticeGalleryOptions);
  groups: Group[] = [];
  // group: Group = { _id: '', name: '' };
  group: Group | null = null;



  ngOnInit() {
    this.getGroups();
  }

  private getGroups = () => {
    this.groupSearchService.getGroups().subscribe(groups => {
      console.log('groups', groups)
      this.groups = groups;
      console.log('this.groups', this.groups)
    })
  }

  public getNoticesForGroup = () => {
    if (this.group?._id) {
      this.deathNoticeGalleryOptions.groupId = this.group._id;
    } else {
      this.deathNoticeGalleryOptions.groupId = '';
    }
    this.deathNoticeGalleryOptions.pageNo = 1;
    this.deathNoticeGalleryService.getNotices().subscribe()
  }
}

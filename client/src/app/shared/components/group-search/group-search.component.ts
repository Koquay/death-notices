import { Component, inject } from '@angular/core';
import { GroupSearchService } from './group-search.service';
import { Group } from '../../interfaces/groups.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../home/home.service';

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
  private homeServices = inject(HomeService);
  groups: Group[] = [];
  group: Group = { _id: '', name: '' };


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
    if (this.group._id) {
      this.groupSearchService.getNoticesForGroup(this.group._id).subscribe();
    } else {
      this.homeServices.getNotices().subscribe()
    }
  }
}

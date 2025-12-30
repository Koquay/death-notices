import { Component, effect, inject } from '@angular/core';
import { HomeService } from './home.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Contact } from '../shared/interfaces/contacts.interface';
import { Event } from '../shared/interfaces/events.interface';
import { SearchComponent } from '../shared/components/search/search.component';
import { SearchService } from '../shared/components/search/search.service';
import { MemoriamComponent } from '../memoriam/memoriam.component';
import { GroupSearchComponent } from '../shared/components/group-search/group-search.component';
import { GroupSearchService } from '../shared/components/group-search/group-search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    DatePipe,
    SearchComponent,
    MemoriamComponent,
    GroupSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private homeService = inject(HomeService);
  private searchService = inject(SearchService);
  private groupSearchService = inject(GroupSearchService);
  public notices: NoticesModel[] = []
  public apiUrl = '/api/notices';

  noticeEffect = effect(() => {
    this.notices = this.homeService.noticesSignal().notices;
  });

  groupSearchEffect = effect(() => {
    this.notices = this.groupSearchService.groupSearchSignal();
  });



  ngOnInit() {
    this.homeService.getNotices().subscribe(notices => {
      this.notices = notices;
    })
  }


  searchEffect = effect(() => {
    this.notices = this.searchService.searchSignal();
  })



}

export class NoticesModel {
  _id!: string;
  name!: string;
  img!: string;
  imageId!: string | undefined;
  death_date!: Date;
  birth_date!: Date;
  announcement: string = '';
  additionalInformation: string = '';

  contacts: Contact[] = [
    {
      name: '',
      relationship: '',
      phone: ''
    }
  ];

  events: Event[] = [
    {
      type: '',
      date: null,
      date_str: '',
      time: null,
      location: '',
      address: '',
      city: '',
      state: '',
    }
  ];


}

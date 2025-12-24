import { Component, inject } from '@angular/core';
import { HomeService } from './home.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Contact } from '../shared/interfaces/contacts.interface';
import { Event } from '../shared/interfaces/events.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private homeService = inject(HomeService);
  public notices: NoticesModel[] = []
  public apiUrl = '/api/notices';

  ngOnInit() {
    this.homeService.getNotices().subscribe(notices => {
      this.notices = notices;
    })
  }

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

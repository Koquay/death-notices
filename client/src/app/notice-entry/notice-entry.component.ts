import { Component, inject } from '@angular/core';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { NoticeEntryModel } from './notice-entry.model';
import { FormsModule } from '@angular/forms';
import { NoticeEntryService } from './notice-entry.service';
import { CommonModule } from '@angular/common';

interface Contact {
  name: string;
  relationship: string;
  cell_phone: string;
  land_line: string;
}

@Component({
  selector: 'app-notice-entry',
  standalone: true,
  imports: [
    AppImageUploadComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './notice-entry.component.html',
  styleUrl: './notice-entry.component.scss'
})
export class NoticeEntryComponent {

  public noticeEntryModel = inject(NoticeEntryModel);
  private noticeEntryService = inject(NoticeEntryService);

  addContact() {
    this.noticeEntryModel.contacts.push({
      name: '',
      relationship: '',
      phone: ''
    });
  }

  removeContact(index: number) {
    this.noticeEntryModel.contacts.splice(index, 1);
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
  }

  removeEvent(index: number) {
    this.noticeEntryModel.events.splice(index, 1);
  }

  addEvent() {
    this.noticeEntryModel.events.push({
      type: '',
      date: null,
      date_str: '',
      time: null,
      location: '',
      address: '',
      city: '',
      state: '',
    });
  }



  public saveEventData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
  }

  public submitNotice = () => {
    let d = new Date(this.noticeEntryModel.death_date);

    // Create a date-only value (no timezone shift)
    this.noticeEntryModel.death_date = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );

    d = new Date(this.noticeEntryModel.birth_date);

    // Create a date-only value (no timezone shift)
    this.noticeEntryModel.birth_date = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );


    console.log('submitNotice.noticeEntryModel:', this.noticeEntryModel);
    this.noticeEntryService.submitNotice(this.noticeEntryModel);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { EditNoticeService } from './edit-notice.service';
import { EditNoticeModel } from './edit-notice.model';

@Component({
  selector: 'app-edit-notice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppImageUploadComponent
  ],
  templateUrl: './edit-notice.component.html',
  styleUrl: './edit-notice.component.scss'
})
export class EditNoticeComponent {

  public editNoticeModel = inject(EditNoticeModel);
  private editNoticeService = inject(EditNoticeService);
  public apiUrl = '/api/notices';
  public operation = 'edit-notice'
  public birth_date?: string;

  addContact() {
    this.editNoticeModel?.contacts.push({
      name: '',
      relationship: '',
      phone: ''
    });
  }

  removeContact(index: number) {
    this.editNoticeModel?.contacts.splice(index, 1);
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.editNoticeModel:', this.editNoticeModel);
  }

  removeEvent(index: number) {
    this.editNoticeModel?.events.splice(index, 1);
  }

  addEvent() {
    this.editNoticeModel?.events.push({
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
    console.log('saveNoticeData.editNoticeModel:', this.editNoticeModel);
  }

  public submitNoticeEdits = () => {
    this.editNoticeModel = {
      ...this.editNoticeModel,
      birth_date: new Date(this.editNoticeModel.birth_date_str),
      death_date: new Date(this.editNoticeModel.death_date_str),

    };

    this.editNoticeModel.events = this.editNoticeModel.events.map(event => ({
      ...event,
      time: event.time && event.time !== '' ? event.time : null
    }));

    console.log('submitNoticeEdits.editNoticeModel:', this.editNoticeModel);
    this.editNoticeService.submitNoticeEdits(this.editNoticeModel as EditNoticeModel);
  }

  public toggleEditImageMode = () => {
    this.editNoticeModel.editImageMode = true;
  }


}

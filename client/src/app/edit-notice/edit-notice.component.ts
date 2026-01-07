import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { EditNoticeService } from './edit-notice.service';
import { EditNoticeModel } from './edit-notice.model';
import { Group } from '../shared/interfaces/groups.interface';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';

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

  selectedGroups: Group[] = [];
  groups: Group[] = [];
  group: Group = { _id: '', name: null };
  newGroup?: string | null;

  ngOnInit() {
    this.getGroups();
  }

  addContact() {
    this.editNoticeModel?.contacts.push({
      name: '',
      relationship: '',
      phone: ''
    });
  }

  removeContact(index: number) {
    this.editNoticeModel?.contacts.splice(index, 1);
    this.saveNoticeData();
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.editNoticeModel:', this.editNoticeModel);
    persistStateToLocalStorage({ editNoticeModel: this.editNoticeModel });
  }

  removeEvent(index: number) {
    this.editNoticeModel?.events.splice(index, 1);
    this.saveNoticeData();
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

  private getGroups = () => {
    this.editNoticeService.getGroups().subscribe(groups => {
      console.log('groups', groups)
      this.groups = groups;
    })
  }

  addDeceasedGroup() {
    this.editNoticeModel.groups = this.selectedGroups;
    this.saveNoticeData();
  }

  addNewGroup() {
    this.newGroup = this.newGroup?.trim();

    if (this.newGroup) {
      this.group.name = this.newGroup;
      this.editNoticeService.addNewGroup(this.group).subscribe(groups => {
        this.groups = groups;
        this.group.name = null;
        this.newGroup = null;
      })


      this.saveNoticeData();
    }
  }

  removeDeceasedGroup(group: Group) {
    this.selectedGroups = this.selectedGroups.filter(g => g._id !== group._id);
    this.editNoticeModel.groups = this.selectedGroups;
    this.saveNoticeData();
  }
}

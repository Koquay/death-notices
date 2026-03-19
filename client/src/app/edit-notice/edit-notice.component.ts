import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { EditNoticeService } from './edit-notice.service';
import { EditNoticeModel } from './edit-notice.model';
import { Group } from '../shared/interfaces/groups.interface';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { ActivatedRoute } from '@angular/router';

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
  private activatedRoute = inject(ActivatedRoute);
  public apiUrl = '/api/notices';
  public operation = 'edit-notice'
  public birth_date?: string;

  selectedGroups: Group[] = [];
  groups: Group[] = [];
  group: Group = { _id: '', name: null };
  newGroup?: string | null;
  @ViewChild('groupContainer') groupContainer!: ElementRef;

  ngOnInit() {
    this.getNotice();
  }

  private getNotice = () => {
    this.activatedRoute.params.subscribe((params) => {
      const noticeNo = params['noticeNo'];
      console.log('ActivatedRoute params:', noticeNo);

      this.editNoticeService.getNotice(noticeNo).subscribe({
        next: () => {
          console.log('EditNoticeComponent Notice fetched successfully:', this.editNoticeModel);
          this.getGroups();
        },
        error: (error) => {
          console.log('error', error)
        }
      });
    });


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


  public submitNoticeEdits = () => {
    this.editNoticeModel = {
      ...this.editNoticeModel,
      birth_date: new Date(this.editNoticeModel.birth_date_str),
      death_date: new Date(this.editNoticeModel.death_date_str),

    };

    this.editNoticeModel.events = this.editNoticeModel.events.map(event => ({
      ...event,
      time: event.time && event.time !== '' ? event.time : null,

      // date: new Date(event.date_str),

      date: event.date_str ? new Date(event.date_str) : null
    }));

    for (let event of this.editNoticeModel.events) {
      console.log('event.date_str:', event.date_str);
      console.log('parsed:', new Date(event.date_str));
    }

    console.log('submitNoticeEdits.editNoticeModel:', this.editNoticeModel);
    this.editNoticeService.submitNoticeEdits(this.editNoticeModel as EditNoticeModel);
  }

  public toggleEditImageMode = () => {
    this.editNoticeModel.editImageMode = true;
  }

  get formCompletionPercent(): number {
    let total = 0;
    let completed = 0;

    // Required simple fields
    const requiredFields = [
      this.editNoticeModel.name,
      this.editNoticeModel.death_date_str,
      this.editNoticeModel.announcement,
    ];

    total += requiredFields.length;
    completed += requiredFields.filter(f => !!f).length;

    // Events (all required fields per event)
    this.editNoticeModel.events.forEach(event => {
      const eventFields = [
        event.type,
        event.date_str,
        event.time,
        event.location,
        event.address,
        event.city,
        event.state
      ];

      total += eventFields.length;
      completed += eventFields.filter(f => !!f).length;
    });

    // Contacts
    this.editNoticeModel.contacts.forEach(contact => {
      const contactFields = [
        contact.name,
        contact.phone
      ];

      total += contactFields.length;
      completed += contactFields.filter(f => !!f).length;
    });

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }


  /* ================================
     GROUPS SECTION (CLEAN VERSION)
  ================================ */

  groupSearch: string = '';
  showGroupDropdown = false;

  filteredGroups(): Group[] {
    if (!this.groupSearch.trim()) return this.groups;

    return this.groups.filter(g =>
      g.name?.toLowerCase().includes(this.groupSearch.toLowerCase())
    );
  }

  isGroupSelected(group: Group): boolean {
    return this.selectedGroups.some(g => String(g._id) === String(group._id));
  }

  toggleGroup(group: Group): void {
    if (this.isGroupSelected(group)) {
      this.selectedGroups = this.selectedGroups.filter(
        g => g._id !== group._id
      );
    } else {
      this.selectedGroups = [...this.selectedGroups, group];
    }

    this.groupSearch = '';
    this.syncGroupsToModel();
  }

  removeGroup2(groupId: string): void {
    this.selectedGroups = this.selectedGroups.filter(
      g => String(g._id) !== String(groupId)
    );

    this.syncGroupsToModel();
  }

  groupExists(name: string): boolean {
    return this.groups.some(
      g => g.name?.toLowerCase() === name.trim().toLowerCase()
    );
  }

  createGroupFromSearch(): void {
    const name = this.groupSearch.trim();
    if (!name) return;

    this.editNoticeService.addNewGroup({ _id: '', name })
      .subscribe(groups => {
        this.groups = groups;

        const created = this.groups.find(
          g => g.name?.toLowerCase() === name.toLowerCase()
        );

        if (created && !this.isGroupSelected(created)) {
          this.selectedGroups = [...this.selectedGroups, created];
        }

        this.groupSearch = '';
        this.showGroupDropdown = false;

        this.syncGroupsToModel();
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.groupContainer) return;

    const clickedInside = this.groupContainer.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showGroupDropdown = false;
    }
  }

  private syncGroupsToModel(): void {
    this.editNoticeModel.groups = [...this.selectedGroups];
    this.saveNoticeData();
  }

  onGroupSearch(event: any): void {
    const value = event.target.value || '';
    this.groupSearch = value;
  }

  private getGroups = () => {
    this.editNoticeService.getGroups().subscribe(groups => {
      this.groups = groups;

      if (this.editNoticeModel.groups?.length) {
        this.selectedGroups = [...this.editNoticeModel.groups];
      }

      console.log('EditNoticeComponent:editNoticeModel.groups fetched:', this.editNoticeModel.groups);
      console.log('EditNoticeComponent:selectedGoups fetched:', this.selectedGroups);
    });
  }



}

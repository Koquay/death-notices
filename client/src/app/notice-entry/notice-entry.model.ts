import { Injectable } from '@angular/core';
import { Event } from '../shared/interfaces/events.interface';
import { Contact } from '../shared/interfaces/contacts.interface';
import { Group } from '../shared/interfaces/groups.interface';



@Injectable({
    providedIn: 'root'
})
export class NoticeEntryModel {
    _id!: string;
    name!: string;
    imageFile!: File;
    imageId!: string;
    public apiUrl = '/api/notices';
    death_date!: Date;
    birth_date!: Date;
    date_str!: string;
    announcement: string = '';
    relationship: string = '';
    editImageMode = false;

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

    groups: Group[] = [
        {
            name: null,
        }
    ];

    additionalInformation: string = '';
}
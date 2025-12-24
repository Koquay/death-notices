import { Injectable } from '@angular/core';
import { Event } from '../shared/interfaces/events.interface';
import { Contact } from '../shared/interfaces/contacts.interface';



@Injectable({
    providedIn: 'root'
})
export class EditNoticeModel {
    _id!: string;
    name!: string;
    imageFile!: File;
    imageId!: string;
    public apiUrl = '/api/notices';
    death_date!: Date;
    birth_date!: Date;
    birth_date_str!: string;
    death_date_str!: string;
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

    additionalInformation: string = '';
}
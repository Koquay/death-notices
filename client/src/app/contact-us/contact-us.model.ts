import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContactUsModel {
    _id!: string;
    name: string = '';
    email: string = 'kkwilson852@gmail.com';
    message: string = '';
}
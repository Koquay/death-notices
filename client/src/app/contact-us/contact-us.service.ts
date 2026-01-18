import { inject, Injectable } from '@angular/core';
import { ContactUsModel } from './contact-us.model';
import { HttpClient } from '@angular/common/http';
import { ToastUtils } from '../shared/utils/toastUtils';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  public contactUsModel = inject(ContactUsModel);
  private toastrUtils = inject(ToastUtils);
  public httpClient = inject(HttpClient);
  private apiUrl = '/api/contact-us'

  contactUs = () => {
    this.httpClient.post(`${this.apiUrl}`, { contactUsData: this.contactUsModel }).subscribe({
      next: (response) => {
        console.log('Message submitted successfully:', response);
        this.toastrUtils.show(
          'success',
          'Your message was sent successfully.',
          'Message Success'
        );
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while sending your message.',
          'Message Error'
        );
      }
    });
  }
}

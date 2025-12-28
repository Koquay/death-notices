import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastUtils } from '../../shared/utils/toastUtils';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';

@Injectable({
  providedIn: 'root'
})
export class EnterMemoriamService {

  private apiUrl = '/api/notices';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);;
  private paymentIntentUrl = '/api/payment/payment-intent';


  public submitMemoriam = (memoriamEntryModel: NoticeEntryModel) => {
    const fd = new FormData();

    fd.append(
      'notice',
      JSON.stringify({
        name: memoriamEntryModel.name,
        announcement: memoriamEntryModel.announcement,
        relationship: memoriamEntryModel.relationship,

      })
    );

    fd.append('image', memoriamEntryModel.imageFile);


    console.log('FormData being sent:');
    fd.forEach((value, key) => console.log(key, value));

    this.httpClient.post(`${this.apiUrl}/memoriam`, fd).subscribe({
      next: (response) => {
        console.log('Memoriam submitted successfully:', response);
        this.toastrUtils.show(
          'success',
          'Memoriam submitted successfully.',
          'Memoriam Success'
        );
      },
      error: (error) => {
        console.error('Error submitting memoriam:', error);
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while submitting the memoriam.',
          'Memoriam Error'
        );
      }
    });
  }
}

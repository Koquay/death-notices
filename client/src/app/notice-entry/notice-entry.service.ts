import { inject, Injectable } from '@angular/core';
import { NoticeEntryModel } from './notice-entry.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticeEntryService {
  private apiUrl = '/api/notices';
  private httpClient = inject(HttpClient);
  private paymentIntentUrl = '/api/payment/payment-intent';


  public submitNotice = (noticeEntryModel: NoticeEntryModel) => {
    const fd = new FormData();

    fd.append(
      'notice',
      JSON.stringify({
        name: noticeEntryModel.name,
        announcement: noticeEntryModel.announcement,
        relationship: noticeEntryModel.relationship,
        death_date: noticeEntryModel.death_date,
        birth_date: noticeEntryModel.birth_date,
        contacts: noticeEntryModel.contacts,
        events: noticeEntryModel.events,
        additionalInformation: noticeEntryModel.additionalInformation,

      })
    );

    fd.append('image', noticeEntryModel.imageFile);


    console.log('FormData being sent:');
    fd.forEach((value, key) => console.log(key, value));

    this.httpClient.post(this.apiUrl, fd).subscribe({
      next: (response) => {
        console.log('Notice submitted successfully:', response);
      },
      error: (error) => {
        console.error('Error submitting notice:', error);
      }
    });
  }

  public createPaymentIntent = (paymentInfo: { amount: number, currency: string }) => {
    // console.log('PlaceOrder.checkoutSignal', this.checkoutSignal())

    return this.httpClient.post(this.paymentIntentUrl, paymentInfo).pipe(
      tap(paymentIntent => {
        console.log('new paymentIntent', paymentIntent)
        // this.toastr.success('Payment intent established', 'Payment Intent',
        //   { positionClass: getScrollPos() })
      }),
      catchError(error => {
        console.log('error', error)
        // this.toastr.error(error.message, 'Payment Intent',
        //   { positionClass: getScrollPos() });
        throw error;
      })
    )

  }

}

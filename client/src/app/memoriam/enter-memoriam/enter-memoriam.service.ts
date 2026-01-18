import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastUtils } from '../../shared/utils/toastUtils';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnterMemoriamService {

  private apiUrl = '/api/memoriams';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  private paymentIntentUrl = '/api/payment/payment-intent';


  public submitMemoriam = (memoriamEntryModel: NoticeEntryModel) => {
    const fd = new FormData();

    fd.append(
      'memoriam',
      JSON.stringify({
        name: memoriamEntryModel.name,
        announcement: memoriamEntryModel.announcement,
        relationship: memoriamEntryModel.relationship,
        email: memoriamEntryModel.email,

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
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while checking your credit card.',
          'Payment Intent Error'
        );
        throw error;
      })
    )

  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ToastUtils } from '../shared/utils/toastUtils';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);
  private url = '/api/order';
  private paymentIntentUrl = '/api/payment/payment-intent';

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
          error.message || 'An error occurred while creating payment intent.',
          'Create Payment Intent Error'
        );
        throw error;
      })
    )

  }
}

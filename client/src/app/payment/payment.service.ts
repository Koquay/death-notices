import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private httpClient = inject(HttpClient);
  // private toastr = inject(ToastrService)
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
        // this.toastr.error(error.message, 'Payment Intent',
        //   { positionClass: getScrollPos() });
        throw error;
      })
    )

  }
}

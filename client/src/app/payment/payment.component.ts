import { Component, inject } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  private paymentService = inject(PaymentService);
  stripe: Stripe | null = null;
  cardElement: any;
  card: any;
  elements: any;
  clientSecret: string = "";
  private cartTotal: number = 0;

  ngOnInit() {
    this.setUpStripe();
  }

  public setUpStripe = async () => {
    this.stripe = await loadStripe(environment.pk_test);

    if (this.stripe) {
      this.elements = this.stripe.elements();

      this.card = this.elements.create('card', {
        hidePostalCode: true
      });
      this.card.mount('#card-element');

    }

    this.paymentService.createPaymentIntent({ amount: this.cartTotal, currency: 'usd' }).subscribe((paymentIntent => {
      for (const [key, value] of Object.entries(paymentIntent)) {
        if (key === 'client_secret') {
          console.log(`${key}: ${value}`);
          this.clientSecret = value as string;
          console.log('clientSecret', this.clientSecret);
        }

      }
    }))
  }
}

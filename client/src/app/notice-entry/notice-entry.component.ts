import { Component, inject } from '@angular/core';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { NoticeEntryModel } from './notice-entry.model';
import { FormsModule } from '@angular/forms';
import { NoticeEntryService } from './notice-entry.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-notice-entry',
  standalone: true,
  imports: [
    AppImageUploadComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './notice-entry.component.html',
  styleUrl: './notice-entry.component.scss'
})
export class NoticeEntryComponent {

  public noticeEntryModel = inject(NoticeEntryModel);
  private noticeEntryService = inject(NoticeEntryService);

  stripe: Stripe | null = null;
  cardElement: any;
  card: any;
  elements: any;
  clientSecret: string = "";

  ngOnInit() {
    this.setUpStripe();
  }

  public setUpStripe = async () => {
    this.stripe = await loadStripe(environment.pk_test);

    console.log('Stripe loaded:', this.stripe);

    if (this.stripe) {
      this.elements = this.stripe.elements();

      this.card = this.elements.create('card', {
        hidePostalCode: true
      });
      this.card.mount('#card-element');

    }

    this.noticeEntryService.createPaymentIntent({ amount: 100, currency: 'usd' }).subscribe((paymentIntent => {
      for (const [key, value] of Object.entries(paymentIntent)) {
        if (key === 'client_secret') {
          console.log(`${key}: ${value}`);
          this.clientSecret = value as string;
          console.log('clientSecret', this.clientSecret);
        }

      }
    }))
  }

  addContact() {
    this.noticeEntryModel.contacts.push({
      name: '',
      relationship: '',
      phone: ''
    });
  }

  removeContact(index: number) {
    this.noticeEntryModel.contacts.splice(index, 1);
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
  }

  removeEvent(index: number) {
    this.noticeEntryModel.events.splice(index, 1);
  }

  addEvent() {
    this.noticeEntryModel.events.push({
      type: '',
      date: null,
      date_str: '',
      time: null,
      location: '',
      address: '',
      city: '',
      state: '',
    });
  }



  public saveEventData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
  }

  public submitNotice = async () => {
    if (!this.stripe || !this.clientSecret) {
      // this.toastr.error('There may be a problem with your credit card.', 'Error Placing Order',
      //   { positionClass: getScrollPos() }
      // );
      return;
    }

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        // billing_details: {
        //   address: {
        //     postal_code: this.billingPostalCode
        //   }
        // }
      },
    });

    if (result.error) {
      // this.toastr.error(result.error.message, 'Error Placing Order',
      //   { positionClass: getScrollPos() });
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment succeeded!');
      this.completeNoticeSubmission();
      //   this.toastr.success('Order successfully placed', 'Order Success',
      //     { positionClass: getScrollPos() });
      // }
    }
  }

  private completeNoticeSubmission = () => {
    let d = new Date(this.noticeEntryModel.death_date);

    // Create a date-only value (no timezone shift)
    this.noticeEntryModel.death_date = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );

    d = new Date(this.noticeEntryModel.birth_date);

    // Create a date-only value (no timezone shift)
    this.noticeEntryModel.birth_date = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );


    console.log('submitNotice.noticeEntryModel:', this.noticeEntryModel);
    this.noticeEntryService.submitNotice(this.noticeEntryModel);
  }
}

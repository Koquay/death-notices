import { Component, inject } from '@angular/core';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { NoticeEntryModel } from './notice-entry.model';
import { FormsModule } from '@angular/forms';
import { NoticeEntryService } from './notice-entry.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';
import { ToastUtils } from '../shared/utils/toastUtils';
import { Group } from '../shared/interfaces/groups.interface';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { PaypalButtonComponent } from '../payment paypal/paypal-button/paypal-button.component';

@Component({
  selector: 'app-notice-entry',
  standalone: true,
  imports: [
    AppImageUploadComponent,
    FormsModule,
    CommonModule,
    PaypalButtonComponent
  ],
  templateUrl: './notice-entry.component.html',
  styleUrl: './notice-entry.component.scss'
})
export class NoticeEntryComponent {

  public noticeEntryModel = inject(NoticeEntryModel);
  private noticeEntryService = inject(NoticeEntryService);
  private toastrUtils = inject(ToastUtils);;

  stripe: Stripe | null = null;
  cardElement: any;
  card: any;
  elements: any;
  clientSecret: string = "";
  public noticePrice: number = environment.notice_amount;

  paymentType = 'CreditCard';

  selectedGroups: Group[] = [];
  groups: Group[] = [];
  group: Group = { _id: '', name: null };
  newGroup?: string | null;

  ngOnInit() {
    // this.setUpStripe();
    console.log('noticeEntryModel on init:', this.noticeEntryModel);
    this.getGroups();
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

    this.noticeEntryService.createPaymentIntent({ amount: environment.notice_amount, currency: 'usd' }).subscribe((paymentIntent => {
      for (const [key, value] of Object.entries(paymentIntent)) {
        if (key === 'client_secret') {
          console.log(`${key}: ${value}`);
          this.clientSecret = value as string;
          console.log('clientSecret', this.clientSecret);
        } else {
          // this.toastrUtils.show(
          //   'error',
          //   'There may be a problem with your credit card.',
          //   'Error Establishing Payment Intent'
          // );
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
    this.saveNoticeData();
  }

  addDeceasedGroup() {
    this.noticeEntryModel.groups = this.selectedGroups;
    this.saveNoticeData();
  }

  addNewGroup() {
    this.newGroup = this.newGroup?.trim();

    if (this.newGroup) {
      this.group.name = this.newGroup;
      this.noticeEntryService.addNewGroup(this.group).subscribe(groups => {
        this.groups = groups;
        this.group.name = null;
        this.newGroup = null;
      })


      this.saveNoticeData();
    }
  }

  removeGroup(index: number) {
    this.noticeEntryModel.groups.splice(index, 1);
    this.saveNoticeData();
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
    console.log('saveNoticeData.selectedGroups:', this.selectedGroups);
    persistStateToLocalStorage({ noticeEntryModel: this.noticeEntryModel });
  }

  removeEvent(index: number) {
    this.noticeEntryModel.events.splice(index, 1);
    this.saveNoticeData();
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
    // if (!this.stripe || !this.clientSecret) {
    //   this.toastrUtils.show(
    //     'error',
    //     'There may be a problem with your credit card.',
    //     'Error Processing Payment'
    //   );
    //   return;
    // }

    // const result = await this.stripe.confirmCardPayment(this.clientSecret, {
    //   payment_method: {
    //     card: this.card,
    //   },
    // });

    // if (result.error) {
    //   this.toastrUtils.show(
    //     'error',
    //     result.error.message,
    //     'Error Processing Payment'
    //   );

    //   console.error(result.error.message);
    // } else if (result.paymentIntent?.status === 'succeeded') {
    //   console.log('Payment intent succeeded!');
    //   this.completeNoticeSubmission();
    // }

    // to be removed
    this.completeNoticeSubmission();
  }

  public completeNoticeSubmission = () => {
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

    for (let event of this.noticeEntryModel.events) {
      d = new Date(event.date as Date);

      event.date = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
    }



    console.log('submitNotice.noticeEntryModel:', this.noticeEntryModel);
    this.noticeEntryService.submitNotice(this.noticeEntryModel);
  }

  private getGroups = () => {
    this.noticeEntryService.getGroups().subscribe(groups => {
      console.log('groups', groups)
      this.groups = groups;
    })
  }

  onPaymentTypeChange(): void {
    if (this.paymentType === 'PayPal') {
      // setTimeout(() => this.renderPaypalButton(), 0);
    } else if (this.paymentType === 'CreditCard') {
      setTimeout(() => this.setUpStripe(), 0);
    }
  }

  onPaymentTypeCreditCard() {
    if (this.paymentType === 'CreditCard') {
      setTimeout(() => this.setUpStripe(), 0);
    }
  }

}

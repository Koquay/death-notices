import { Component, HostListener, ElementRef, inject, ViewChild } from '@angular/core';
import { AppImageUploadComponent } from '../app-image-upload/app-image-upload.component';
import { NoticeEntryModel } from './notice-entry.model';
import { FormsModule, NgForm } from '@angular/forms';
import { NoticeEntryService } from './notice-entry.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';
import { ToastUtils } from '../shared/utils/toastUtils';
import { Group } from '../shared/interfaces/groups.interface';
import { persistStateToLocalStorage } from '../shared/utils/localStorageUtils';
import { PaypalButtonComponent } from '../payment paypal/paypal-button/paypal-button.component';
import { debounceTime, Subject } from 'rxjs';

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
  @ViewChild('noticeForm') noticeForm!: NgForm;

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
  @ViewChild('groupContainer') groupContainer!: ElementRef;

  private persistNoticeSubject = new Subject<void>();

  ngOnInit() {
    // this.setUpStripe();
    console.log('noticeEntryModel on init:', this.noticeEntryModel);
    this.getGroups();

    this.persistNoticeSubject
      .pipe(debounceTime(800))
      .subscribe(() => {
        persistStateToLocalStorage({
          noticeEntryModel: this.noticeEntryModel
        });
      });
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


  public saveNoticeData = () => {
    console.log('saveNoticeData.noticeEntryModel:', this.noticeEntryModel);
    console.log('saveNoticeData.selectedGroups:', this.selectedGroups);
    this.persistNoticeSubject.next();
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


  public submitNotice = async () => {
    if (this.noticeForm.invalid) return;

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
    // let d = new Date(this.noticeEntryModel.death_date);

    // // Create a date-only value (no timezone shift)
    // this.noticeEntryModel.death_date = new Date(
    //   Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    // );

    // d = new Date(this.noticeEntryModel.birth_date);

    // // Create a date-only value (no timezone shift)
    // this.noticeEntryModel.birth_date = new Date(
    //   Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    // );

    // for (let event of this.noticeEntryModel.events) {
    //   d = new Date(event.date as Date);

    //   event.date = new Date(
    //     Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    //   );
    // }

    this.noticeEntryModel = {
      ...this.noticeEntryModel,
      birth_date: new Date(this.noticeEntryModel.birth_date_str),
      death_date: new Date(this.noticeEntryModel.death_date_str),

    };

    this.noticeEntryModel.events = this.noticeEntryModel.events.map(event => ({
      ...event,
      time: event.time && event.time !== '' ? event.time : null
    }));


    console.log('submitNotice.noticeEntryModel:', this.noticeEntryModel);
    this.noticeEntryService.submitNotice(this.noticeEntryModel);
    this.noticeForm.resetForm();
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

  get formCompletionPercent(): number {
    let total = 0;
    let completed = 0;

    // Required simple fields
    const requiredFields = [
      this.noticeEntryModel.name,
      this.noticeEntryModel.death_date_str,
      this.noticeEntryModel.announcement,
      this.noticeEntryModel.buyer_name,
      this.noticeEntryModel.email
    ];

    total += requiredFields.length;
    completed += requiredFields.filter(f => !!f).length;

    // Events (all required fields per event)
    this.noticeEntryModel.events.forEach(event => {
      const eventFields = [
        event.type,
        event.date_str,
        event.time,
        event.location,
        event.address,
        event.city,
        event.state
      ];

      total += eventFields.length;
      completed += eventFields.filter(f => !!f).length;
    });

    // Contacts
    this.noticeEntryModel.contacts.forEach(contact => {
      const contactFields = [
        contact.name,
        contact.phone
      ];

      total += contactFields.length;
      completed += contactFields.filter(f => !!f).length;
    });

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }

  /* ================================
     GROUPS SECTION (CLEAN VERSION)
  ================================ */

  groupSearch: string = '';
  showGroupDropdown = false;

  filteredGroups(): Group[] {
    if (!this.groupSearch.trim()) return this.groups;

    return this.groups.filter(g =>
      g.name?.toLowerCase().includes(this.groupSearch.toLowerCase())
    );
  }

  isGroupSelected(group: Group): boolean {
    return this.selectedGroups.some(g => g._id === group._id);
  }

  toggleGroup(group: Group): void {
    if (this.isGroupSelected(group)) {
      this.selectedGroups = this.selectedGroups.filter(
        g => g._id !== group._id
      );
    } else {
      this.selectedGroups = [...this.selectedGroups, group];
    }

    this.groupSearch = '';
    this.syncGroupsToModel();
  }

  removeGroup2(groupId: string): void {
    this.selectedGroups = this.selectedGroups.filter(
      g => g._id !== groupId
    );

    this.syncGroupsToModel();
  }

  groupExists(name: string): boolean {
    return this.groups.some(
      g => g.name?.toLowerCase() === name.trim().toLowerCase()
    );
  }

  createGroupFromSearch(): void {
    const name = this.groupSearch.trim();
    if (!name) return;

    this.noticeEntryService.addNewGroup({ _id: '', name })
      .subscribe(groups => {
        this.groups = groups;

        const created = this.groups.find(
          g => g.name?.toLowerCase() === name.toLowerCase()
        );

        if (created && !this.isGroupSelected(created)) {
          this.selectedGroups = [...this.selectedGroups, created];
        }

        this.groupSearch = '';
        this.showGroupDropdown = false;

        this.syncGroupsToModel();
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.groupContainer) return;

    const clickedInside = this.groupContainer.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showGroupDropdown = false;
    }
  }

  private getGroups = () => {
    this.noticeEntryService.getGroups().subscribe(groups => {
      this.groups = groups;

      if (this.noticeEntryModel.groups?.length) {
        this.selectedGroups = this.groups.filter(g =>
          this.noticeEntryModel.groups.some(
            saved => saved._id === g._id
          )
        );
      }
    });
  }

  private syncGroupsToModel(): void {
    this.noticeEntryModel.groups = [...this.selectedGroups];
    this.saveNoticeData();
  }

  onGroupSearch(event: any): void {
    const value = event.target.value || '';
    this.groupSearch = value;
  }
}

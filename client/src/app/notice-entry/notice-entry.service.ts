import { inject, Injectable } from '@angular/core';
import { NoticeEntryModel } from './notice-entry.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ToastUtils } from '../shared/utils/toastUtils';
import { Group } from '../shared/interfaces/groups.interface';
import { FormatDateTimeUtils } from '../shared/utils/formatDateTimeUtil';

@Injectable({
  providedIn: 'root'
})
export class NoticeEntryService {
  private apiUrl = '/api/notices';
  private httpClient = inject(HttpClient);
  private toastrUtils = inject(ToastUtils);;
  private formatDateTimeUtils = inject(FormatDateTimeUtils);;
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
        groups: noticeEntryModel.groups,
        additionalInformation: noticeEntryModel.additionalInformation,
        email: noticeEntryModel.email,
        buyer_name: noticeEntryModel.buyer_name,

      })
    );

    fd.append('image', noticeEntryModel.imageFile);


    console.log('FormData being sent:');
    fd.forEach((value, key) => console.log(key, value));

    this.httpClient.post(this.apiUrl, fd).subscribe({
      next: (response) => {
        console.log('Notice submitted successfully:', response);

        Object.assign(noticeEntryModel, response);

        noticeEntryModel.birth_date_str = this.formatDateTimeUtils.formatDateForInput(noticeEntryModel.birth_date);
        noticeEntryModel.death_date_str = this.formatDateTimeUtils.formatDateForInput(noticeEntryModel.death_date);

        for (let i = 0; i < noticeEntryModel.events.length; i++) {
          noticeEntryModel.events[i].date_str = this.formatDateTimeUtils.formatDateForInput(noticeEntryModel.events[i].date as Date);

          noticeEntryModel.events[i].time =
            this.formatDateTimeUtils.formatTimeForInput(noticeEntryModel.events[i].time);
        }
        this.toastrUtils.show(
          'success',
          'Notice submitted successfully.',
          'Notice Success'
        );
      },
      error: (error) => {
        console.error('Error submitting notice:', error);
        this.toastrUtils.show(
          'error',
          error.message || 'An error occurred while submitting the notice.',
          'Notice Error'
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

  public getGroups = () => {
    return this.httpClient.get<Group[]>(`${this.apiUrl}/groups`).pipe(
      tap(groups => {

      })
    )
  }

  public addNewGroup = (group: Group) => {
    return this.httpClient.post<Group[]>(`${this.apiUrl}/group`, group).pipe(
      tap(groups => {

      })
    )
  }

}

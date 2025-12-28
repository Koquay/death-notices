import { Component, inject } from '@angular/core';
import { AppImageUploadComponent } from '../../app-image-upload/app-image-upload.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';
import { ToastUtils } from '../../shared/utils/toastUtils';
import { EnterMemoriamService } from './enter-memoriam.service';

@Component({
  selector: 'app-enter-memoriam',
  standalone: true,
  imports: [
    AppImageUploadComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './enter-memoriam.component.html',
  styleUrl: './enter-memoriam.component.scss'
})
export class EnterMemoriamComponent {
  public memoriamEntryModel = inject(NoticeEntryModel);
  private enterMemoriamService = inject(EnterMemoriamService);
  private toastrUtils = inject(ToastUtils);


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

    this.completeNoticeSubmission();
  }

  private completeNoticeSubmission = () => {
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


    console.log('submitNotice.noticeEntryModel:', this.memoriamEntryModel);
    this.enterMemoriamService.submitMemoriam(this.memoriamEntryModel);
  }

  public saveNoticeData = () => {
    console.log('saveNoticeData.memoriamEntryModel:', this.memoriamEntryModel);
  }
}

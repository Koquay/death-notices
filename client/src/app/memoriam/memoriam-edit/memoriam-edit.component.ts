import { Component, effect, inject } from '@angular/core';
import { NoticeEntryModel } from '../../notice-entry/notice-entry.model';
import { ToastUtils } from '../../shared/utils/toastUtils';
import { MemoriamEditService } from './memoriam-edit.service';
import { AppImageUploadComponent } from '../../app-image-upload/app-image-upload.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memoriam-edit',
  standalone: true,
  imports: [
    AppImageUploadComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './memoriam-edit.component.html',
  styleUrl: './memoriam-edit.component.scss'
})
export class MemoriamEditComponent {
  public memoriamEntryModel = inject(NoticeEntryModel);
  private memoriamEditService = inject(MemoriamEditService);
  private toastrUtils = inject(ToastUtils);
  public operation = 'edit-memoriam';
  public apiUrl = '/api/memoriams';

  public submitMemoriam = async () => {
    console.log('submitMemoriam.memoriamEntryModel:', this.memoriamEntryModel);
    this.memoriamEditService.submitMemoriam();
  }

  public saveMemoriamData = () => {
    console.log('saveNoticeData.memoriamEntryModel:', this.memoriamEntryModel);
  }

  public toggleEditImageMode = () => {
    this.memoriamEntryModel.editImageMode = true;
  }
}

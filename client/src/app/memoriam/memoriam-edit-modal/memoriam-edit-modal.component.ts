import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoriamEditService } from '../memoriam-edit/memoriam-edit.service';

@Component({
  selector: 'app-memoriam-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './memoriam-edit-modal.component.html',
  styleUrl: './memoriam-edit-modal.component.scss'
})
export class MemoriamEditModalComponent {
  public memoriamEditService = inject(MemoriamEditService);
  public memoriamNumber: string = '';

  public getMemoriamByNo() {
    this.memoriamEditService.getMemoriamByNo(this.memoriamNumber);
  }

}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemoriamEditService } from '../memoriam-edit/memoriam-edit.service';

declare var bootstrap: any;

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
  private router = inject(Router);
  public memoriamEditService = inject(MemoriamEditService);
  public memoriamNumber: string = '';

  public getMemoriamByNo() {
    this.memoriamEditService.getMemoriamByNo(this.memoriamNumber);
  }

}

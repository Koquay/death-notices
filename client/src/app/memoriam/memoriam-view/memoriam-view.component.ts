import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemoriamViewService } from './memoriam-view.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memoriam-view',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './memoriam-view.component.html',
  styleUrl: './memoriam-view.component.scss'
})
export class MemoriamViewComponent {
  private activatedRoute = inject(ActivatedRoute);
  private memoriamViewService = inject(MemoriamViewService);
  public memoriam = this.memoriamViewService.memoriamViewSignal().memoriam;
  public apiUrl = '/api/memoriams';

  memoriamEffect = effect(() => {
    this.memoriam = this.memoriamViewService.memoriamViewSignal().memoriam;
    console.log('MemoriamViewComponent.memoriaml:', this.memoriam);
  });

  ngOnInit() {
    this.getMemoriam();
  }

  private getMemoriam = () => {
    const memoriamId = this.activatedRoute.snapshot.paramMap.get('memoriamId') as string || "";
    console.log("Memoriam ID:", memoriamId);
    this.memoriamViewService.getMemoriam(memoriamId);
  }
}

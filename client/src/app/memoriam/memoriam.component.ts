import { Component, effect, inject } from '@angular/core';
import { MemoriamService } from './memoriam.service';
// import { NoticeEntryModel } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { MemoriamSearchComponent } from './memoriam-search/memoriam-search.component';
import { MemoriamSearchService } from './memoriam-search/memoriam-search.service';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { MemoriamViewComponent } from './memoriam-view/memoriam-view.component';
import { RouterModule } from '@angular/router';
import { SkeletonCirclesComponent } from '../shared/components/skeletons/skeleton-circles/skeleton-circles.component';

@Component({
  selector: 'app-memoriam',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MemoriamSearchComponent,
    MemoriamViewComponent,
    SkeletonCirclesComponent
  ],
  templateUrl: './memoriam.component.html',
  styleUrl: './memoriam.component.scss'
})
export class MemoriamComponent {
  private memoriamService = inject(MemoriamService);
  private memoriamSearchService = inject(MemoriamSearchService);
  public memoriams: NoticeEntryModel[] = []
  public apiUrl = '/api/memoriams';
  public isLoading = true;

  memoriamEffect = effect(() => {
    this.memoriams = this.memoriamService.memoriamsSignal().memoriams;
    this.isLoading = false;
  });

  memoriamSearchEffect = effect(() => {
    this.memoriams = this.memoriamSearchService.memoriamSignal();
  });

  ngOnInit() {
    this.memoriamService.getMemoriams().subscribe(memoriams => {
      this.memoriams = memoriams;
    })
  }
}

import { Component, effect, inject } from '@angular/core';
import { MemoriamService } from './memoriam.service';
// import { NoticeEntryModel } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { MemoriamSearchComponent } from './memoriam-search/memoriam-search.component';
import { MemoriamSearchService } from './memoriam-search/memoriam-search.service';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';

@Component({
  selector: 'app-memoriam',
  standalone: true,
  imports: [
    CommonModule,
    MemoriamSearchComponent
  ],
  templateUrl: './memoriam.component.html',
  styleUrl: './memoriam.component.scss'
})
export class MemoriamComponent {
  private memoriamService = inject(MemoriamService);
  private memoriamSearchService = inject(MemoriamSearchService);
  public memoriams: NoticeEntryModel[] = []
  public apiUrl = '/api/notices';

  memoriamEffect = effect(() => {
    this.memoriams = this.memoriamService.memoriamsSignal().memoriams;
  });

  memoriamSearchEffect = effect(() => {
    this.memoriams = this.memoriamSearchService.memoriamSignal();
  });

  ngOnInit() {
    // this.memoriamService.getMemoriams();
    this.memoriamService.getMemoriams().subscribe(memoriams => {
      this.memoriams = memoriams;
    })
  }
}

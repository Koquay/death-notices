import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YearSearchService } from './year-search.service';
import { DeathNoticeGalleryService } from '../../../death-notice-gallery/death-notice-gallery.service';
import { DeathNoticeGalleryOptions } from '../../../death-notice-gallery/death-notice-gallery.options';

@Component({
  selector: 'app-year-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './year-search.component.html',
  styleUrl: './year-search.component.scss'
})
export class YearSearchComponent {
  private deathNoticeGalleryService = inject(DeathNoticeGalleryService);
  private deathNoticeGalleryOptions = inject(DeathNoticeGalleryOptions);
  public deathYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  public selectedYear: string = '2026';

  public getDeceasedByYear = () => {
    this.deathNoticeGalleryOptions.year = this.selectedYear;
    this.deathNoticeGalleryOptions.pageNo = 1;
    this.deathNoticeGalleryService.getNotices().subscribe();
  }
}

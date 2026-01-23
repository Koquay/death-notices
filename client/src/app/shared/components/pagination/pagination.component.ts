import { CommonModule } from '@angular/common';
import { Component, effect, inject, } from '@angular/core';
import { DeathNoticeGalleryService } from '../../../death-notice-gallery/death-notice-gallery.service';
import { DeathNoticeGalleryOptions } from '../../../death-notice-gallery/death-notice-gallery.options';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  private deathNoticeGalleryService = inject(DeathNoticeGalleryService);
  private deathNoticeGalleryOptions = inject(DeathNoticeGalleryOptions);
  public pages: number[] = [];
  public pageNo = 1;
  public numberOfPages = 0;
  public pageSize = 0;
  public totalCount = 0;

  private deathNoticeOptionsEffect = effect(() => {
    this.pageSize = this.deathNoticeGalleryService.deathNOticeGallerySignal().pageSize;
    this.totalCount = this.deathNoticeGalleryService.deathNOticeGallerySignal().totalCount;
    console.log('deathNoticeOptionsEffect.pageSize', this.pageSize)
    console.log('deathNoticeOptionsEffect.totalCount', this.totalCount)
    this.computeVariables()
  })

  private computeVariables() {
    this.numberOfPages = Math.ceil(
      this.totalCount / this.pageSize
    );
    console.log('this.numberOfPages', this.numberOfPages)

    this.pages = [];
    for (let i = 1; i <= this.numberOfPages; i++) {
      this.pages.push(i);
    }
  }

  public getPage = (pageNo: number) => {
    this.pageNo = pageNo;
    // this.pageChangeEvent.emit(this.pageNo)
    console.log('getPage.pageNo', this.pageNo)
    this.deathNoticeGalleryOptions.pageNo = pageNo;
    this.deathNoticeGalleryService.getNotices().subscribe();
  }

  public getAdjacentPage(direction: string) {
    console.log('pageNo', direction)
    if (direction === 'next') {
      if (this.pageNo < this.numberOfPages) {
        ++this.pageNo;
        this.deathNoticeGalleryOptions.pageNo = this.pageNo;
        this.deathNoticeGalleryService.getNotices().subscribe();
      }
    } else if (direction === 'prev') {
      if (this.pageNo > 1) {
        --this.pageNo;
        this.deathNoticeGalleryOptions.pageNo = this.pageNo;
        this.deathNoticeGalleryService.getNotices().subscribe();
      }
    }
  }

}

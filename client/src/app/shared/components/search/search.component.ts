import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SearchService } from './search.service';
import { DeathNoticeGalleryService } from '../../../death-notice-gallery/death-notice-gallery.service';
import { DeathNoticeGalleryOptions } from '../../../death-notice-gallery/death-notice-gallery.options';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  public searchField = '';
  private searchSubject = new Subject<string>();
  private searchService = inject(SearchService);
  private deathNoticeGalleryService = inject(DeathNoticeGalleryService);
  private deathNoticeGalleryOptions = inject(DeathNoticeGalleryOptions);

  ngOnInit() {
    this.handleSearch();
  }

  onSearchFieldChanged(value: string) {
    this.searchSubject.next(value);
  }

  private handleSearch() {
    this.searchSubject.pipe(
      distinctUntilChanged(),
      debounceTime(600)
    ).subscribe(searchField => {
      if (searchField) {
        console.log('searchField', searchField);
        this.deathNoticeGalleryOptions.searchField = searchField
        // this.search(searchField)
      } else {
        this.deathNoticeGalleryOptions.searchField = '';
      }
      this.deathNoticeGalleryOptions.pageNo = 1;
      this.deathNoticeGalleryService.getNotices().subscribe();

    });
  }

  search = (searchField: string) => {
    this.searchService.searchForNotices(searchField);
  }
}

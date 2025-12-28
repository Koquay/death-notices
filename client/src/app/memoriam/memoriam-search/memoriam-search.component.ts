import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MemoriamSearchService } from './memoriam-search.service';
import { MemoriamService } from '../memoriam.service';

@Component({
  selector: 'app-memoriam-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './memoriam-search.component.html',
  styleUrl: './memoriam-search.component.scss'
})
export class MemoriamSearchComponent {
  public searchField = '';
  private searchSubject = new Subject<string>();
  private searchService = inject(MemoriamSearchService);
  private memoriamService = inject(MemoriamService);

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

        this.search(searchField)
      } else {
        this.memoriamService.getMemoriams().subscribe();
      }

    });
  }

  search = (searchField: string) => {
    this.searchService.searchForMemoriams(searchField);
  }
}

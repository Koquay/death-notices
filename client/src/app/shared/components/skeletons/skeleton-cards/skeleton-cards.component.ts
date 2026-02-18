import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-cards',
  standalone: true,
  templateUrl: './skeleton-cards.component.html',
  styleUrls: ['./skeleton-cards.component.scss']
})
export class SkeletonCardsComponent {
  @Input() count = 8;

  get placeholders() {
    return Array(this.count);
  }
}

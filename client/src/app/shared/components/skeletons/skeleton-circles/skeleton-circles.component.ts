import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-circles',
  standalone: true,
  templateUrl: './skeleton-circles.component.html',
  styleUrls: ['./skeleton-circles.component.scss']
})
export class SkeletonCirclesComponent {
  @Input() count = 6;

  get placeholders() {
    return Array(this.count);
  }
}

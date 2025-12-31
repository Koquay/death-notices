import { Component, } from '@angular/core';
import { MemoriamComponent } from '../memoriam/memoriam.component';
import { DeathNoticeGalleryComponent } from '../death-notice-gallery/death-notice-gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MemoriamComponent,
    DeathNoticeGalleryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}

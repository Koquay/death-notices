import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactUsModel } from './contact-us.model';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  public contactUsModel = inject(ContactUsModel);
  private contactUsService = inject(ContactUsService);


  contactUs = () => {
    this.contactUsService.contactUs();
  }
}

import { Component, ViewChild, ElementRef, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NoticeEntryModel } from '../notice-entry/notice-entry.model';
import { EditNoticeModel } from '../edit-notice/edit-notice.model';

@Component({
  selector: 'app-image-upload',
  templateUrl: './app-image-upload.component.html',
  styleUrls: ['./app-image-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AppImageUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private noticeEntryModel = inject(NoticeEntryModel);
  private editNoticeModel = inject(EditNoticeModel);

  @Input() operation: string = '';

  isDragging = false;
  preview: string | null = null;
  fileError: string | null = null;
  selectedFile: File | null = null;
  // config
  maxFileSize = 5 * 1024 * 1024; // 5 MB

  constructor(private http: HttpClient) { }

  onFileSelected(ev: Event) {

    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    console.log('File selected via input:', file);
    if (file) this.handleFile(file);
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = false;
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = false;
    const file = ev.dataTransfer?.files?.[0] ?? null;
    if (file) this.handleFile(file);
  }

  private handleFile(file: File) {
    this.fileError = null;
    console.log('handleFile.file', file);

    if (!file.type.startsWith('image/')) {
      this.resetFile('Only image files are allowed.');
      return;
    }
    if (file.size > this.maxFileSize) {
      this.resetFile('Image is too large (max 5MB).');
      return;
    }

    // 🔑 Keep both in sync
    this.selectedFile = file;

    if (this.operation === 'edit-notice') {
      this.editNoticeModel.imageFile = file;
      console.log('handleFile.this.editNoticeModel.imageFile', this.editNoticeModel.imageFile);
    } else {
      this.noticeEntryModel.imageFile = file;
      console.log('handleFile.this.noticeEntryModel.imageFile', this.noticeEntryModel.imageFile);
    }

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result as string);
    reader.readAsDataURL(file);

    console.log('selected file:', file);
  }


  // private handleFile(file: File) {
  //   this.fileError = null;

  //   if (!file.type.startsWith('image/')) {
  //     this.resetFile('Only image files are allowed.');
  //     return;
  //   }
  //   if (file.size > this.maxFileSize) {
  //     this.resetFile('Image is too large (max 5MB).');
  //     return;
  //   }

  //   this.noticeEntryModel.imageFile = file;

  //   const reader = new FileReader();
  //   reader.onload = () => (this.preview = reader.result as string);
  //   reader.readAsDataURL(file);

  //   console.log('selected file:', file);
  // }

  private resetFile(msg?: string) {
    this.selectedFile = null;
    this.preview = null;
    this.fileInput.nativeElement.value = '';
    this.fileError = msg ?? null;
    // this.noticeEntryModel.imgFd = new FormData();
  }

  onSubmit(form: NgForm) {
    // Quick client-side check for file presence:
    if (!this.selectedFile) {
      this.fileError = 'Please select an image before submitting.';
      return;
    }

    if (form.invalid) {
      // let template-driven controls show validation messages
      return;
    }

    const fd = new FormData();
    fd.append('image', this.selectedFile!, this.selectedFile!.name);
    fd.append('title', form.value.title ?? '');

    // Upload (replace URL)
    this.http.post('/api/upload', fd).subscribe({
      next: () => console.log('uploaded'),
      error: (err) => console.error(err),
    });
  }

  // helper getters for template-driven validation demo
  get titleInvalid() {
    // example: read an input by name from the DOM could be done differently;
    // you can also add template references and check them directly.
    return false; // implement as needed for showing title errors
  }
  get titleTouched() {
    return false;
  }
}

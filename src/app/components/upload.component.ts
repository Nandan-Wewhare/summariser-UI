import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-light">
      <div class="card-body">
        <div class="mb-3">
          <input 
            type="file" 
            accept=".pdf" 
            (change)="onFileSelect($event)"
            class="form-control"
          >
        </div>
        <p class="text-muted small mb-0">Only PDF files are allowed</p>
        @if (error) {
          <p class="text-danger small mt-2 mb-0">{{ error }}</p>
        }
      </div>
    </div>
  `,
  styles: []  // Remove custom styles since we're using Bootstrap
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  error: string | null = null;

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.error = null;
      this.fileSelected.emit(file);
    } else {
      this.error = 'Please select a valid PDF file';
    }
  }
}
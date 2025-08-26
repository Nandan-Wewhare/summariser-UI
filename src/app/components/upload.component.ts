import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload">
      <input 
        type="file" 
        accept=".pdf" 
        (change)="onFileSelect($event)"
        class="file-input"
      >
      <p class="hint">Only PDF files are allowed</p>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </div>
  `,
  styles: [`
    .file-upload {
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 20px;
    }
    .hint {
      color: #666;
      font-size: 14px;
    }
    .error {
      color: red;
      font-size: 14px;
    }
  `]
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
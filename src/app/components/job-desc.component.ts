import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="job-description">
      <textarea
        [(ngModel)]="description"
        (ngModelChange)="onDescriptionChange($event)"
        placeholder="Paste job description here..."
        rows="6"
      ></textarea>
    </div>
  `,
  styles: [`
    .job-description textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
    }
  `]
})
export class JobDescriptionComponent {
  @Output() descriptionChange = new EventEmitter<string>();
  description: string = '';

  onDescriptionChange(value: string) {
    this.descriptionChange.emit(value);
  }
}
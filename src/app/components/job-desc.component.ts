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
        placeholder="Paste job description here (minimum 150 words)..."
        rows="6"
        class="form-control mb-2"
        [class.is-invalid]="showError"
      ></textarea>
      <div *ngIf="showError" class="invalid-feedback">
        Job description must be at least 150 words. Current word count: {{ currentWordCount }}
      </div>
    </div>
  `,
  styles: []
})
export class JobDescriptionComponent {
  @Output() descriptionChange = new EventEmitter<string>();
  description: string = '';
  showError: boolean = false;
  currentWordCount: number = 0;
  private readonly MIN_WORDS = 150;

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  onDescriptionChange(value: string) {
    this.currentWordCount = this.countWords(value);
    this.showError = this.currentWordCount < this.MIN_WORDS;
    this.descriptionChange.emit(value);
  }
}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InputComponent {
  text: string = '';
  wordCount: number = 0;
  isValidWordCount: boolean = false;

  countWords(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  }

  onTextChange(event: any) {
    const text = event.target.value;
    this.wordCount = this.countWords(text);
    this.isValidWordCount = this.wordCount >= 150;
  }

  onSubmit() {
    if (!this.isValidWordCount) {
      return;
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDescriptionComponent } from './components/job-desc.component';
import { FileUploadComponent } from './components/upload.component';
import { ResumeAnalyzerService } from './services/analyser.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    JobDescriptionComponent
],
  template: `
    <div class="container">
      <h1>Resume ATS Analyzer</h1>
      
      <div class="analyzer-form">
        <h2>Upload Resume</h2>
        <app-file-upload (fileSelected)="onFileSelected($event)"></app-file-upload>

        <h2>Job Description</h2>
        <app-job-description (descriptionChange)="onDescriptionChange($event)"></app-job-description>

        <button 
          [disabled]="!canAnalyze()"
          (click)="analyzeResume()"
          class="analyze-button"
        >
          Analyze Resume
        </button>

        @if (loading) {
          <div class="loading">Analyzing...</div>
        }

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        @if (result) {
          <div class="result">
            <h3>Analysis Result</h3>
            <div class="score">ATS Pass Probability: {{ result.score }}%</div>
            <div class="feedback">
              <h4>Feedback:</h4>
              <ul>
                @for (item of result.feedback; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  selectedFile: File | null = null;
  jobDescription: string = '';
  loading = false;
  error: string | null = null;
  result: { score: number; feedback: string[] } | null = null;

  constructor(private analyzerService: ResumeAnalyzerService) {}

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onDescriptionChange(description: string) {
    this.jobDescription = description;
  }

  canAnalyze(): boolean {
    return !!this.selectedFile && !!this.jobDescription;
  }

  analyzeResume() {
    if (!this.selectedFile || !this.jobDescription) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    this.analyzerService.analyzeResume(this.selectedFile, this.jobDescription)
      .subscribe({
        next: (result) => {
          this.result = result;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}

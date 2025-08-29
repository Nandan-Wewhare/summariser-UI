import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobDescriptionComponent } from './components/job-desc.component';
import { FileUploadComponent } from './components/upload.component';
import { ResumeAnalyzerService } from './services/analyser.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    JobDescriptionComponent,
    FormsModule
  ],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="text-center mb-5">Resume Analyzer</h1>
          
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="mb-4">
                <h2 class="h4 mb-3">Upload Resume</h2>
                <app-file-upload (fileSelected)="onFileSelected($event)"></app-file-upload>
              </div>

              <div class="mb-4">
                <h2 class="h4 mb-3">Job Description</h2>
                <app-job-description (descriptionChange)="onDescriptionChange($event)"></app-job-description>
              </div>

              <button 
                [disabled]="!canAnalyze() || loading"
                (click)="analyzeResume()"
                class="btn btn-primary w-100 py-2"
              >
                Analyze Resume
              </button>

              @if (loading) {
                <div class="text-center mt-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted">Analyzing...</p>
                </div>
              }

              @if (error) {
                <div class="alert alert-danger mt-4">{{ error }}</div>
              }

              @if (result !== null) {
                <div class="mt-4">
                  <h3 class="h5 mb-3">Analysis Result</h3>
                  <div class="card bg-light">
                    <div class="card-body">
                      <h4 class="text-center mb-3">ATS Pass Probability: 
                        <span [class]="'fw-bold ' + (
                          result >= 85 ? 'text-success' : 
                          result >= 50 ? 'text-warning' : 
                          'text-danger'
                        )">{{ result }}%</span>
                      </h4>
                      
                      @if (result > 0 && insights) {
                        <div class="mt-4">
                          <h5 class="h6 mb-2">Additional Insights:</h5>
                          <p class="mb-0">{{ insights }}</p>
                        </div>
                      } @else if (result === 0) {
                        <div class="mt-4">
                          <p class="text-danger mb-0">Your resume needs significant improvements to pass ATS screening. Consider reviewing and updating your resume format and content.</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
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
  result: number | null = null;
  insights: string | null = null;

  constructor(
    private analyzerService: ResumeAnalyzerService
  ) { }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onDescriptionChange(description: string) {
    this.jobDescription = description;
    // Clear previous results when job description changes
    this.result = null;
    this.insights = null;
    this.error = null;
  }

  canAnalyze(): boolean {
    return !!this.selectedFile && !!this.jobDescription;
  }

  analyzeResume() {
    if (!this.selectedFile || !this.jobDescription) return;

    this.loading = true;
    this.error = null;
    this.result = null;
    this.insights = null;

    this.analyzerService.analyzeResume(this.selectedFile, this.jobDescription)
      .subscribe({
        next: (result) => {
          try {
            const probabilityMatch = result["chatResult"].match(/Probability:\s*(\d+)/);
            this.result = probabilityMatch ? parseInt(probabilityMatch[1], 10) : 0;
            const notesMatch = result["chatResult"].match(/Additional Notes:([\s\S]*?)(?=\n\n|$)/);
            this.insights = notesMatch ? notesMatch[1].trim() : null;
          } catch (e) {
            console.error('Failed to parse result:', e);
            this.error = 'Invalid response format';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Analysis failed:', error);
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}

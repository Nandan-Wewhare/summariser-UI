import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

interface AnalysisResult {
    score: number;
    feedback: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ResumeAnalyzerService {
    private apiUrl = 'https://summarizer25.azurewebsites.net/api';

    constructor(private http: HttpClient) { }

    analyzeResume(resume: File, jobDescription: string): Observable<AnalysisResult> {
        const formData = new FormData();
        formData.append('file', resume);
        formData.append('jobDescription', jobDescription);

        return this.http.post<AnalysisResult>(`${this.apiUrl}/Generate`, formData)
            .pipe(
                catchError(error => {
                    console.error('Analysis error:', error);
                    return throwError(() => new Error('Failed to analyze resume. Please try again.'));
                })
            );
    }
}
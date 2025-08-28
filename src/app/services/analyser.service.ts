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

    analyzeResume(resume: File, jobDescription: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', resume);
        formData.append('jobDescription', jobDescription);

        return this.http.post<any>(`${this.apiUrl}/Generate`, formData);
    }
}
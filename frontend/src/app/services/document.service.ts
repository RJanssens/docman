import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/documents';
  private currentDocumentSubject = new BehaviorSubject<Document | null>(null);
  public currentDocument$ = this.currentDocumentSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`).pipe(
      tap(doc => this.currentDocumentSubject.next(doc))
    );
  }

  createDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, document).pipe(
      tap(doc => this.currentDocumentSubject.next(doc))
    );
  }

  updateDocument(id: number, document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, document).pipe(
      tap(doc => this.currentDocumentSubject.next(doc))
    );
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.currentDocumentSubject.next(null))
    );
  }

  setCurrentDocument(document: Document | null): void {
    this.currentDocumentSubject.next(document);
  }
}

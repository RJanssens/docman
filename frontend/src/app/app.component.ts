import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DocumentService } from './services/document.service';
import { Document } from './models/document.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  documents: Document[] = [];
  currentDocument: Document | null = null;
  showNewDocumentInput = false;
  newDocumentTitle = '';

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        if (docs.length > 0 && !this.currentDocument) {
          this.selectDocument(docs[0]);
        }
      },
      error: (err) => console.error('Error loading documents:', err)
    });
  }

  selectDocument(document: Document): void {
    this.currentDocument = { ...document };
    this.documentService.setCurrentDocument(this.currentDocument);
  }

  createNewDocument(): void {
    if (!this.newDocumentTitle.trim()) {
      return;
    }

    const newDoc: Document = {
      title: this.newDocumentTitle.trim(),
      content: ''
    };

    this.documentService.createDocument(newDoc).subscribe({
      next: (doc) => {
        this.documents.unshift(doc);
        this.currentDocument = doc;
        this.newDocumentTitle = '';
        this.showNewDocumentInput = false;
      },
      error: (err) => console.error('Error creating document:', err)
    });
  }

  saveDocument(): void {
    if (!this.currentDocument || !this.currentDocument.id) {
      return;
    }

    this.documentService.updateDocument(this.currentDocument.id, this.currentDocument).subscribe({
      next: (doc) => {
        const index = this.documents.findIndex(d => d.id === doc.id);
        if (index !== -1) {
          this.documents[index] = doc;
        }
        console.log('Document saved successfully');
      },
      error: (err) => console.error('Error saving document:', err)
    });
  }

  deleteDocument(document: Document, event: Event): void {
    event.stopPropagation();

    if (!document.id || !confirm('Are you sure you want to delete this document?')) {
      return;
    }

    this.documentService.deleteDocument(document.id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== document.id);
        if (this.currentDocument?.id === document.id) {
          this.currentDocument = this.documents.length > 0 ? this.documents[0] : null;
        }
      },
      error: (err) => console.error('Error deleting document:', err)
    });
  }

  onTitleChange(): void {
    if (this.currentDocument) {
      this.saveDocument();
    }
  }

  onContentChange(): void {
    // Auto-save on content change with debouncing
    if (this.currentDocument) {
      this.saveDocument();
    }
  }

  cancelNewDocument(): void {
    this.showNewDocumentInput = false;
    this.newDocumentTitle = '';
  }
}

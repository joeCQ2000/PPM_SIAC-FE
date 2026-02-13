import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.css'],
})
export class PdfPreviewDialogComponent {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string; filename?: string , blob : Blob},
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PdfPreviewDialogComponent>
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    
    
  }
  

  descargar(): void {
    const url = URL.createObjectURL(this.data.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.data.filename || 'muestreo.pdf';
    a.click();
    URL.revokeObjectURL(url);

    // clave: avisar al padre que el usuario sí descargó
    this.dialogRef.close({ downloaded: true });
  }
  close() {
    this.dialogRef.close({downloaded : false});
  }
}
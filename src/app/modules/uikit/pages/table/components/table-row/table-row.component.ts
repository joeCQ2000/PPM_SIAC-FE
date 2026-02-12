import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MuestreoCompleto } from 'src/app/core/models/muestreo.model';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from "angular-svg-icon";
import { PdfService } from 'src/app/core/services/pdf';
import { EspecieService } from 'src/app/core/services/especie';
import { PdfPreviewDialogComponent } from '../pdf-preview/pdf-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TablaListadoDeMuestreoDTO } from 'src/app/core/models/TablaListadoDeMuestreoDTO';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, DatePipe, CommonModule, AngularSvgIconModule],
  standalone: true,
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent implements OnInit {
  @Input() item!: TablaListadoDeMuestreoDTO;

  private finalizados = new Set<number>();
  especieById = new Map<number, string>();

  constructor(
    private router: Router,
    private pdfService: PdfService,
    private especieservice: EspecieService,
    private dialog: MatDialog
  ) {}
 
  ngOnInit() {
    this.cargarFinalizados();

  }

  private cargarFinalizados(): void {
    const raw = localStorage.getItem('muestreos_finalizados');
    const arr: any[] = raw ? JSON.parse(raw) : [];

    this.finalizados = new Set(
      arr
        .map(x => Number(x))
        .filter(n => Number.isFinite(n))
    );
  }

  isFinalizado(id: any): boolean {
    const n = Number(id);
    return Number.isFinite(n) && this.finalizados.has(n);
  }

  editarMuestreo(id: number) {
    this.router.navigate(['/components/muestreo_pesca', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/components/muestreo_pesca', id, 'ver']);
  }

  abrirPDF(id: number) {
    this.pdfService.generarPdf(id).subscribe({
      next: (res) => {
        const blob = res.body!;
        const url = URL.createObjectURL(blob);

        const ref = this.dialog.open(PdfPreviewDialogComponent, {
          width: '80vw',
          maxWidth: '900px',
          data: { url, fileName: `muestreo-${id}.pdf` } 
        });

        ref.afterClosed().subscribe(() => URL.revokeObjectURL(url));
      },
      error: (err) => console.error('Error al generar PDF', err)
    });
  }
}
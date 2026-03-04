import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from "angular-svg-icon";
import { PdfService } from 'src/app/core/services/pdf';
import { EspecieService } from 'src/app/core/services/especie';
import { PdfPreviewDialogComponent } from '../pdf-preview/pdf-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TablaListadoDeMuestreoDTO } from 'src/app/core/models/TablaListadoDeMuestreoDTO';

import { ModelIngresoComponent } from '../modelcreaedita-ingreso/modelcreaedita-ingreso.component';
import { Proyecto } from 'src/app/core/models/proyecto.model';
import { ingreso } from 'src/app/core/models/ingreso.model';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, DatePipe, CommonModule, AngularSvgIconModule],
  standalone: true,
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent implements OnInit {
  @Input() item2!: ingreso;
  @Input() isSelected: boolean = false; 
  @Output() checkboxChange = new EventEmitter<boolean>(); 

    selectedRows: Set<number> = new Set(); 
  private finalizados = new Set<number>();
  especieById = new Map<number, string>();
  ingresos : any[ ] = [];
  constructor(
    private router: Router,
    private pdfService: PdfService,
    private dialog: MatDialog
  ) {}
 
  ngOnInit() {
    this.cargarFinalizados();

  }
  onCheckboxClick(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.checkboxChange.emit(checkbox.checked);
  }
  isRowSelected(idIngreso: number): boolean {
    return this.selectedRows.has(idIngreso);
  }

  toggleRowSelection(idIngreso: number): void {
    if (this.selectedRows.has(idIngreso)) {
      this.selectedRows.delete(idIngreso);
    } else {
      this.selectedRows.add(idIngreso);
    }
  }


  getSelectedRows(): number[] {
    return Array.from(this.selectedRows);
  }

  clearSelection(): void {
    this.selectedRows.clear();
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
 abrirModalNuevo() {
    const dialogRef = this.dialog.open(ModelIngresoComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
      data: { 
        modo: 'crear'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Ingreso creado:', result);
        this.ingresos.push(result);
      }
    });
  }

  editarMuestreo(id: number) {
    this.router.navigate(['/components/muestreo_pesca', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/components/ingresos', id]);
  }
  Eliminar(): void{
    this.router.navigate(['/components/muestreo_pesca']);
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
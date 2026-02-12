import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TableFilterService {
  searchField = signal<string>('');
  statusField = signal<string>('');
  orderField = signal<string>('');
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  NombreComun = signal<string>('');
  matricula = signal<string>('');


  resetAll() {
    this.searchField.set('');
    this.statusField.set('');
    this.orderField.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.NombreComun.set('');
    this.matricula.set('');
  }
}

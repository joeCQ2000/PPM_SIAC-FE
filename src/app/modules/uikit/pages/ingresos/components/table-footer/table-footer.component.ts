import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-table-footer',
  imports: [AngularSvgIconModule, CommonModule],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.css',
})
export class TableFooterComponent {
  @Input() paginaActual = 1;
  @Input() totalPaginas = 1;
  @Input() totalRegistros = 0;
  @Input() tamanioPagina = 10;

  @Output() cambiarPagina = new EventEmitter<number>();
  @Output() cambiarTamanio = new EventEmitter<number>();

  irPaginaAnterior() {
    if (this.paginaActual > 1) {
      this.cambiarPagina.emit(this.paginaActual - 1);
    }
  }

  irPaginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.cambiarPagina.emit(this.paginaActual + 1);
    }
  }
irPagina(num:number){
  console.log('Botón clickeado',num);
  if (num !== this.paginaActual){
    this.cambiarPagina.emit(num);
  }
}
  onTamanioChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.cambiarTamanio.emit(value);
  }

  get inicio(): number {
    return (this.paginaActual - 1) * this.tamanioPagina + 1;
  }

  get fin(): number {
    return Math.min(this.inicio + this.tamanioPagina - 1, this.totalRegistros);
  }
get paginasVisibles(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const maxBotones = 5; 
    let inicio = Math.max(1, actual - Math.floor(maxBotones / 2));
    let fin = inicio + maxBotones - 1;
    if (fin > total) {
      fin = total;
      inicio = Math.max(1, fin - maxBotones + 1);
    }
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }
}


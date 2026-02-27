import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { TableFilterService } from '../../services/table-filter.service';
import { EspecieService } from 'src/app/core/services/especie';
import { Especie } from 'src/app/core/models/especie.model';
import { Embarcaciones } from 'src/app/core/models/embarcaciones.model';
import { MatriculaService } from 'src/app/core/services/embarcaciones';

@Component({
  selector: 'app-table-action',
  imports: [AngularSvgIconModule, CommonModule],
  standalone: true,
  templateUrl: './editar-proyecto.component.html',
  styleUrl: './editar-proyecto.component.css',
})
export class TableActionComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<void>();

  especies: Especie[] = [];
  embarcaciones : Embarcaciones[] =[];

  private search$ = new Subject<string>();
  private matricula$ = new Subject<string>();
  mostrarAvanzado: any;

  constructor(
    public filterService: TableFilterService,
    private especieService: EspecieService,
    private embarcacionesService : MatriculaService,
  ) {}

  ngOnInit(): void {
    this.especieService.Listar().subscribe(d => this.especies = d);
    this.embarcacionesService.listarTodas().subscribe(e => this.embarcaciones = e
    );

    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => {
        this.filterService.searchField.set(v);
        this.filtersChanged.emit();
      });

    this.matricula$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(v => {
        this.filterService.matricula.set(v);
        this.filtersChanged.emit();
      });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search$.next(input.value);
  }

  onMatriculaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const v = select.value;
    this.filterService.matricula.set(v === '0' ? '' : v);
    this.filtersChanged.emit();
  }

  onFechaInicioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterService.fechaInicio.set(input.value);
    this.filtersChanged.emit();
  }

  onFechaFinChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterService.fechaFin.set(input.value);
    this.filtersChanged.emit();
  }

  onEspecieChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const v = select.value;
    this.filterService.NombreComun.set(v === '0' ? '' : v);
    this.filtersChanged.emit();
  }

  resetFilters(
    searchInput: HTMLInputElement,
    selectMatricula: HTMLSelectElement,
    fechaInicio: HTMLInputElement,
    fechaFin: HTMLInputElement,
    selectEspecie: HTMLSelectElement,
  ) {
    searchInput.value = '';
    selectMatricula.value = '';
    fechaInicio.value = '';
    fechaFin.value = '';
    selectEspecie.value = '0';

    this.filterService.searchField.set('');
    this.filterService.matricula.set('');
    this.filterService.fechaInicio.set('');
    this.filterService.fechaFin.set('');
    this.filterService.NombreComun.set('');

    this.filtersChanged.emit();
  }
}
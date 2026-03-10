  import { CommonModule } from '@angular/common';
  import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  import { AngularSvgIconModule } from 'angular-svg-icon';
  import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

  import { TableFilterService } from '../../services/table-filter.service';
  import { EspecieService } from 'src/app/core/services/especie';
  import { Especie } from 'src/app/core/models/especie.model';
  import { Embarcaciones } from 'src/app/core/models/embarcaciones.model';
  import { MatriculaService } from 'src/app/core/services/embarcaciones';
  import { Route, Router } from '@angular/router';
  import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
  import { ModelIngresoComponent } from '../modelcreaedita-ingreso/modelcreaedita-ingreso.component';
  import { toast } from 'ngx-sonner';

  @Component({
    selector: 'app-table-action',
    imports: [AngularSvgIconModule, CommonModule,  MatDialogModule,],
    standalone: true,
    templateUrl: './table-action.component.html',
    styleUrl: './table-action.component.css',
  })
  export class TableActionComponent implements OnInit {
    @Output() filtersChanged = new EventEmitter<void>();
    @Output() proyectoRegistrado = new EventEmitter<any>(); 
      @Output() crearIngresoClick = new EventEmitter<void>(); 
      
    @Input() selectedCount: number = 0; 
     @Input() modoProyecto: boolean = false;
     @Input() idProyecto?: number; 
    @Output() eliminarClick = new EventEmitter<void>();
    proyectos : any[]=[];
    especies: Especie[] = [];
    embarcaciones : Embarcaciones[] =[];

    private search$ = new Subject<string>();
    private matricula$ = new Subject<string>();
    mostrarAvanzado: any;

    constructor(
      public filterService: TableFilterService,
      private especieService: EspecieService,
      private embarcacionesService : MatriculaService,
      private router : Router,
      private dialog: MatDialog,
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
    onEliminarClick(): void {
      this.eliminarClick.emit();
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
    Nuevo(): void{
    this.router.navigate(['/components/modelcrearproyecto']);
    }
  Eliminar(): void{
      this.router.navigate(['/components/muestreo_pesca']);
    }
   abrirModalNuevo(): void {
    console.log('ID Proyecto:', this.idProyecto);

    if (this.idProyecto) {
      
      console.log('Modo proyecto - Emitiendo evento');
      this.crearIngresoClick.emit();
    } else {
    
      console.log('Modo listado general - Abriendo modal');
      this.abrirModalDirecto();
    }
  }

  private abrirModalDirecto(): void {
    const dialogRef = this.dialog.open(ModelIngresoComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: false,
      data: { 
        modo: 'crear'
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('🔙 [TABLE-ACTION] Modal cerrado:', result);
      
      if (result?.accion === 'crear' && result?.data) {
        console.log('Ingreso creado en modo general');
        this.proyectoRegistrado.emit(result);
        
        toast.success('Ingreso registrado correctamente', {
          position: 'bottom-right'
        });
      }
    });
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
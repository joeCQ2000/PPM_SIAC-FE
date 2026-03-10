import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TableFilterService } from './services/table-filter.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ingreso } from 'src/app/core/models/ingreso.model';
import { IngresoService } from 'src/app/core/services/ingreso.service';
import { ModelIngresoComponent } from './components/modelcreaedita-ingreso/modelcreaedita-ingreso.component';
import { MatDialog } from '@angular/material/dialog';
import { ProyectoService } from 'src/app/core/services/proyecto.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class IngresosComponent implements OnInit, OnChanges {
  private readonly url = environment.base;

  @Input() idProyecto?: number;
  @Input() ingresos: ingreso[] = [];
  @Output() recargarProyecto = new EventEmitter<void>();

  items = signal<ingreso[]>([]);
  totalRegistros = signal(0);
  paginas = signal(1);
  tamanioPagina = signal(10);
  selectedIds = signal<number[]>([]);

  selectedCount = computed(() => this.selectedIds().length);
  totalpaginas = computed(() =>
    Math.ceil(this.totalRegistros() / this.tamanioPagina())
  );
  allSelected = computed(() => {
    const itemsCount = this.items().length;
    return itemsCount > 0 && this.selectedIds().length === itemsCount;
  });
  someSelected = computed(() => {
    const count = this.selectedIds().length;
    return count > 0 && count < this.items().length;
  });

  constructor(
    private http: HttpClient,
    private filterService: TableFilterService,
    private router: Router,
    private dialog: MatDialog,
    private ingresoservice: IngresoService,
      private cdr: ChangeDetectorRef,
      private proyectoService: ProyectoService
  ) {}

  ngOnInit() {
    console.log('🔍 Inicialización del componente');
    console.log('ID Proyecto:', this.idProyecto);
    console.log('Ingresos recibidos:', this.ingresos.length);

    if (this.ingresos.length === 0 && !this.idProyecto) {
      console.log('Modo listado general');
      this.cargarPagina(1);
    } else {
      console.log('Modo detalle de proyecto');
      this.actualizarDatosDelPadre();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ingresos'] && !changes['ingresos'].firstChange) {
      console.log(' Ingresos actualizados desde el padre');
      console.log('Cantidad:', changes['ingresos'].currentValue.length);
      this.actualizarDatosDelPadre();
    }
  }

  private actualizarDatosDelPadre(): void {
    console.log('Actualizando datos del padre');
    console.log('Ingresos a asignar:', this.ingresos.length);

    this.items.set(this.ingresos);
    this.totalRegistros.set(this.ingresos.length);
    this.paginas.set(1);
    this.selectedIds.set([]);

    console.log('Items actualizados:', this.items().length);
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      const allIds = this.items().map(item => item.id_ingreso);
      this.selectedIds.set(allIds);
    } else {
      this.selectedIds.set([]);
    }
  }

  cargarPagina(page: number) {
    const endpoint = `${this.url}api/Ingresos/ListarIngresos`;

    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(this.tamanioPagina()));

    const search = this.filterService.searchField().trim();
    const matricula = this.filterService.matricula().trim();
    const nombreComun = this.filterService.NombreComun().trim();
    const fi = this.filterService.fechaInicio();
    const ff = this.filterService.fechaFin();

    if (search) params = params.set('search', search);
    if (matricula) params = params.set('matricula', matricula);
    if (nombreComun) params = params.set('nombreComun', nombreComun);
    if (fi) params = params.set('fechaInicio', fi);
    if (ff) params = params.set('fechaFin', ff);

    console.log('QUERY:', params.toString());

    this.http.get<any>(endpoint, { params, withCredentials: true })
      .subscribe({
        next: (res) => {
          const items = res.Items ?? res.items ?? [];
          const total = res.Total ?? res.total ?? 0;
          const curPage = res.Page ?? res.page ?? page;

          this.items.set(items);
          this.totalRegistros.set(total);
          this.paginas.set(curPage);
          this.selectedIds.set([]);
        },
        error: (error) => this.handleRequestError(error)
      });
  }

  onFiltersChanged() {
    this.cargarPagina(1);
  }

  onCambiarPagina(p: number) {
    this.cargarPagina(p);
  }

  onCambiarTamanio(s: number) {
    this.tamanioPagina.set(s);
    this.cargarPagina(1);
  }

  onCheckboxChange(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.update(ids => [...ids, id]);
    } else {
      this.selectedIds.update(ids => ids.filter(i => i !== id));
    }

    console.log('selectedCount:', this.selectedCount());
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }
  abrirModalCrearIngreso(): void {
  if (!this.idProyecto) {
    toast.error('No se pudo identificar el proyecto', {
      position: 'bottom-right'
    });
    return;
  }

  const dialogRef = this.dialog.open(ModelIngresoComponent, {
    width: '800px',
    maxWidth: '95vw',
    data: { modo: 'crear', idProyecto: this.idProyecto },
    disableClose: false
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.accion === 'crear' && result?.data) {
      console.log('✅ Ingreso creado, recargando...');

      this.recargarIngresosDelProyecto();
      this.recargarProyecto.emit();

      
      toast.success('Ingreso registrado correctamente', {
        position: 'bottom-right'
      });
    }
  });
}

private recargarIngresosDelProyecto(): void {
  if (!this.idProyecto) {
    console.warn('⚠️ No hay ID de proyecto para recargar');
    return;
  }

  console.log('🔄 Recargando proyecto:', this.idProyecto);

  this.proyectoService.BuscarPorId(this.idProyecto).subscribe({
    next: (proyecto) => {
      console.log('✅ Proyecto recargado:', proyecto);
      
      // 🔥 Extrae los ingresos (ajusta según la estructura de tu respuesta)
      const nuevosIngresos = proyecto.ingresos || proyecto.ingresos || [];
      
      console.log('📊 Ingresos encontrados:', nuevosIngresos.length);
      
      // Actualiza los datos locales
      this.ingresos = nuevosIngresos;
      this.items.set(nuevosIngresos);
      this.totalRegistros.set(nuevosIngresos.length);
      
      // Fuerza la detección de cambios
      this.cdr.detectChanges();
      
      console.log('✅ Tabla actualizada correctamente');
    },
    error: (error) => {
      console.error('❌ Error recargando proyecto:', error);
      toast.error('Error al actualizar los datos', {
        position: 'bottom-right',
        description: 'Por favor, recarga la página'
      });
    }
  });
}
onIngresoRegistradoGeneral(result: any): void {
  console.log('Ingreso registrado en lista general:', result);

  this.cargarPagina(this.paginas());
}
  eliminarSeleccionados(): void {
    const ids = this.selectedIds();

    if (ids.length === 0) {
      toast.error('No hay ingresos seleccionados', {
        position: 'bottom-right',
        duration: 2000
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${ids.length} ingreso(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3758F9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffff',
      color: '#282828'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarEliminacion(ids);
      }
    });
  }

  private ejecutarEliminacion(ids: number[]): void {
    let completados = 0;
    let errores = 0;

    ids.forEach(id_ingreso => {
      this.ingresoservice.Eliminar(id_ingreso).subscribe({
        next: () => {
          completados++;
          if (completados + errores === ids.length) {
            this.finalizarEliminacion(completados, errores, ids);
          }
        },
        error: () => {
          errores++;
          if (completados + errores === ids.length) {
            this.finalizarEliminacion(completados, errores, ids);
          }
        }
      });
    });
  }

 private finalizarEliminacion(exitosos: number, fallidos: number, idsEliminados: number[]): void {
  this.selectedIds.set([]);

  if (this.idProyecto) {
    console.log('🔄 Recargando después de eliminar...');
    this.recargarIngresosDelProyecto();
    this.recargarProyecto.emit();
  } else {
    this.cargarPagina(this.paginas());
  }

  if (fallidos === 0) {
    Swal.fire({
      icon: 'success',
      title: `${exitosos} ingreso(s) eliminado(s)`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#1E293B',
      color: '#ffff'
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: `${exitosos} eliminados, ${fallidos} fallidos`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#1E293B',
      color: '#ffff'
    });
  }
}

  private handleRequestError(error: any) {
    toast.error('Error al cargar listado', {
      position: 'bottom-right',
      description: error.message,
    });
  }

  toggleMuestreo(checked: boolean) {
    console.log('Checkbox del header marcado', checked);
  }

  goToRegistro(): void {
    this.router.navigate(['/components/muestreo_pesca']);
  }
}
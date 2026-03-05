import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, computed, OnInit, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TablaListadoDeMuestreoDTO } from 'src/app/core/models/TablaListadoDeMuestreoDTO';
import { TableFilterService } from './services/table-filter.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { CommonModule } from '@angular/common';
import { PaginadoDTO } from 'src/app/core/models/PaginadoDTO';
import { Proyecto } from 'src/app/core/models/proyecto.model';
import Swal from 'sweetalert2';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import { egreso } from 'src/app/core/models/egreso.model';
import { EgresoService } from 'src/app/core/services/egreso.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ AngularSvgIconModule, FormsModule, TableHeaderComponent, TableFooterComponent, TableRowComponent, TableActionComponent, CommonModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class EgresosComponent implements OnInit {
  private readonly url = environment.base;
  items = signal<egreso[]>([]);
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
    private egresoService : EgresoService    
  ) {}

  ngOnInit() {
    this.cargarPagina(1);
  }
  toggleSelectAll(checked: boolean): void {
    
    if (checked) {

      const allIds = this.items().map(item => item.id_proyecto); 
      this.selectedIds.set(allIds);
    } else {
 
      this.selectedIds.set([]);
    }
  }
  onProyectoRegistrado(proyecto: any) {
    console.log('Recargando tabla después del registro:', proyecto);
    this.cargarPagina(1);
  }

  cargarPagina(page: number) {
  const endpoint = `${this.url}api/Egresos/ListarEgresos`;

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
    this.selectedIds.update(ids => {
      const newIds = [...ids, id];
      return newIds;
    });
  } else {
    this.selectedIds.update(ids => {
      const newIds = ids.filter(i => i !== id);
      return newIds;
    });
  }
  
  console.log('selectedCount:', this.selectedCount());
  }


  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  eliminarSeleccionados(): void {
    const ids = this.selectedIds();
    
    if (ids.length === 0) {
      toast.error('No hay proyectos seleccionados', {
        position: 'bottom-right',
        duration: 2000
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${ids.length} proyecto(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1E293B',
      color: '#ffff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarEliminacion(ids);
      }
    });
  }
  private ejecutarEliminacion(ids: number[]): void {
    let completados = 0;
    let errores = 0;

    ids.forEach(id_egreso => {
      this.egresoService.Eliminar(id_egreso).subscribe({
        next: () => {
          completados++;
          if (completados + errores === ids.length) {
            this.finalizarEliminacion(completados, errores);
          }
        },
        error: () => {
          errores++;
          if (completados + errores === ids.length) {
            this.finalizarEliminacion(completados, errores);
          }
        }
      });
    });
  }
private finalizarEliminacion(exitosos: number, fallidos: number): void {
    this.selectedIds.set([]); // Limpiar selección
    this.cargarPagina(this.paginas()); // Recargar tabla

    if (fallidos === 0) {
      Swal.fire({
        icon: 'success',
        title: `${exitosos} proyecto(s) eliminado(s)`,
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
  toggleMuestreo(checked: boolean){
  console.log('Checkbox del header marcado', checked);
}
  goToRegistro(): void {
    this.router.navigate(['/components/muestreo_pesca']);
  }
}
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

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ AngularSvgIconModule, FormsModule, TableHeaderComponent, TableFooterComponent, TableRowComponent, TableActionComponent, CommonModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  private readonly url = environment.base; // asegúrate que tenga / al final o ajusta abajo

  items = signal<TablaListadoDeMuestreoDTO[]>([]);
  totalRegistros = signal(0);

  paginas = signal(1);
  tamanioPagina = signal(10);

  totalpaginas = computed(() =>
    Math.ceil(this.totalRegistros() / this.tamanioPagina())
  );

  constructor(
    private http: HttpClient,
    private filterService: TableFilterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPagina(1);
  }

  cargarPagina(page: number) {
  const endpoint = `${this.url}api/MuestreoCompleto/listado`;

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
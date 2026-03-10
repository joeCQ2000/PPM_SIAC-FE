import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProyectoService } from 'src/app/core/services/proyecto.service';
import Swal from 'sweetalert2';
import { Proyecto } from 'src/app/core/models/proyecto.model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresosComponent } from "../../../ingresos/ingresos.component";
import { EgresosComponent } from "../../../egresos/egresos.component";
import { BuscarPorIdProyecto } from '../../../egresos/services/ProyectoPorIdDTO';
import { toast } from 'ngx-sonner';
import { ModelProyectoComponent } from '../modelcreaedita-proyecto/modelcrear-proyecto.component';
import { AngularSvgIconModule } from "angular-svg-icon";
import { ingreso } from 'src/app/core/models/ingreso.model';
import { egreso } from 'src/app/core/models/egreso.model';
@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './modelcrear-proyecto.component.html',
  styleUrl: './modelcrear-proyecto.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    AngularSvgIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    IngresosComponent,
    EgresosComponent
]
})
export class DetalleProyectoComponent implements OnInit {
  
proyecto: BuscarPorIdProyecto | null = null;
  idProyecto: number = 0;
  ingresos: ingreso[] = [];
  egresos: egreso[] = [];
  
  
  tabActiva: string = 'ingreso';
  
  cargando: boolean = false;
  error: string = '';

  filtros = {
    tipo: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
      private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProyecto = +params['id'];
      console.log('ID del proyecto:', this.idProyecto);
      
      if (this.idProyecto) {
        this.cargarProyecto();
      } else {
        this.error = 'ID de proyecto no válido';
      }
    });
  }

  cargarProyecto(): void {
    this.cargando = true;
    this.error = '';
    
    this.proyectoService.BuscarPorId(this.idProyecto).subscribe({
      next: (response) => {
        this.proyecto = response;
        
        this.ingresos = response.ingresos || [];
        this.egresos = response.egresos || [];
        
        this.cargando = false;
        
         console.group('✅ Datos Cargados Correctamente');
      console.log('Proyecto:', this.proyecto);
      console.log('Ingresos:', this.ingresos.length, 'registros');
      console.log('Egresos:', this.egresos.length, 'registros');
      console.log('IDs de ingresos:', this.ingresos.map(i => i.id_ingreso));
      console.log('IDs de egresos:', this.egresos.map(e => e.id_egreso));
      console.groupEnd();
      },
      error: (err) => {
        this.error = 'Error al cargar el proyecto';
        this.cargando = false;
        console.error('❌ Error al cargar proyecto:', err);
        toast.error('No se pudo cargar el proyecto', {
          position: 'bottom-right',
          description: err.error?.mensaje || 'Error desconocido'
        });
      }
    });
  }

  cambiarTab(tab: string): void {
    this.tabActiva = tab;
  }

  abrirModalEdicion(): void {
  if (!this.proyecto) {
    toast.error('No hay proyecto cargado para editar', {
      position: 'bottom-right'
    });
    return;
  }

  // 🔥 MAPEA LOS DATOS AL FORMATO QUE ESPERA EL MODAL
  const proyectoParaEditar = {
    id: this.proyecto.id,
    nro_contrato: this.proyecto.nro_Contrato,
    per: this.proyecto.per,
    estado: this.proyecto.estado,
    id_cliente: this.proyecto.idCliente || '', // Asegúrate de tener este campo
    centro_costo: this.proyecto.centro_Costo,
    servicio: this.proyecto.servicio,
    responsable: this.proyecto.responsable,
    fecha_inicio: this.formatearFechaParaInput(this.proyecto.fecha_Inicio),
    descripcion: this.proyecto.descripcion
  };

  const dialogRef = this.dialog.open(ModelProyectoComponent, {
    width: '800px',
    maxWidth: '95vw',
    data: {
      modo: 'editar', 
      proyecto: proyectoParaEditar 
    },
    disableClose: false,
    panelClass: 'custom-dialog-container'
  });

  // 🔥 Escucha cuando se cierra el modal
  dialogRef.afterClosed().subscribe(result => {
    if (result?.accion === 'editar') {
      toast.success('Proyecto actualizado correctamente', {
        position: 'bottom-right'
      });
      this.cargarProyecto(); 
    }
  });
  
}

private formatearFechaParaInput(fecha: Date | string | null | undefined): string {
  if (!fecha) return '';
  
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
}

  volver(): void {
    this.router.navigate(['/components/proyectos']);
  }

  aplicarFiltros(): void {
    console.log('Filtros aplicados:', this.filtros);
    toast.info('Filtros aplicados', { position: 'bottom-right' });
  }

  limpiarFiltros(): void {
    this.filtros = {
      tipo: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    };
  }

  getEstadoClass(estado: boolean | number): string {
    return estado === true || estado === 1 
      ? 'badge bg-success' 
      : 'badge bg-secondary';
  }
  formatearFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) return '-';
    
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    // Verifica si es una fecha válida
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
   getEstadoTexto(estado: boolean | number): string {
    // Convierte 0/1 o false/true a texto
    return estado === true || estado === 1 ? 'Activo' : 'Inactivo';
  }

}
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-proyecto',
  templateUrl: './modelcrear-proyecto.component.html',
  standalone: true,
  imports: [
    CommonModule,          
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule     
  ]
})
export class ModelProyectoComponent implements OnDestroy {
  proyectoForm: FormGroup;
  submitted = false;
  proyecto: Proyecto[] = [];
  
  // Propiedades para controlar el modo
  modoEdicion: boolean = false;
  tituloModal: string = 'Crear Proyecto';
  proyectoId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ModelProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private proyectoservice: ProyectoService,
    private router: Router
  ) {
    // Inicializar formulario
    this.proyectoForm = this.fb.group({
      nro_contrato: ['', Validators.required],
      per: ['', Validators.required],
      estado: [true],
      id_cliente: ['', Validators.required],
      centro_costo: [''],
      servicio: [''],
      responsable: [''],
      fecha_inicio: [''],
      fecha_registro: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      descripcion: ['']
    });
    this.configurarModoEdicion();
  }

  private configurarModoEdicion(): void {
    if (this.data?.modo === 'editar' && this.data?.proyecto) {
      this.modoEdicion = true;
      this.tituloModal = 'Editar Proyecto';
      this.proyectoId = this.data.proyecto.id;

      this.proyectoForm.patchValue({
        nro_contrato: this.data.proyecto.nro_contrato,
        per: this.data.proyecto.per,
        estado: this.data.proyecto.estado ?? true,
        id_cliente: this.data.proyecto.id_cliente,
        centro_costo: this.data.proyecto.centro_costo || '',
        servicio: this.data.proyecto.servicio || '',
        responsable: this.data.proyecto.responsable || '',
        fecha_inicio: this.data.proyecto.fecha_inicio || '',
        descripcion: this.data.proyecto.descripcion || ''
      });
      if (this.data.proyecto.fecha_registro) {
        this.proyectoForm.patchValue({
          fecha_registro: this.data.proyecto.fecha_registro
        });
      }
    } else {
      this.modoEdicion = false;
      this.tituloModal = 'Crear Proyecto';
    }
  }

  registrar(): void {
    this.submitted = true;

    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      Swal.fire({
        icon: 'error',
        title: 'Favor de rellenar los datos faltantes',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        background: '#1E293B',
        color: '#ffff'
      });
      return;
    }
    const proyectoData = this.proyectoForm.getRawValue();

    if (this.modoEdicion && this.proyectoId) {
      // Modo edición
      this.actualizarProyecto(proyectoData);
    } else {
      // Modo creación
      this.crearProyecto(proyectoData);
    }
  }

  private crearProyecto(proyectoData: any): void {
    this.proyectoservice.Registrar(proyectoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Registro exitoso', resp);
          Swal.fire({
            icon: 'success',
            title: 'Proyecto registrado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            background: '#1E293B',
            color: '#ffff'
          });
          this.dialogRef.close({ accion: 'crear', data: resp });
        },
        error: (err) => {
          console.error('Error al registrar', err);
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error al registrar',
            text: err?.error?.message || 'Intente nuevamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 5000,
            background: '#1E293B',
            color: '#ffff'
          });
        }
      });
  }

  private actualizarProyecto(proyectoData: any): void {
    // Agregar el ID al objeto de datos
    const dataConId = { 
    ...proyectoData, 
    id_proyecto: this.proyectoId // 🔥 CORRECTO - Coincide con el backend
  };

    this.proyectoservice.Actualizar(this.proyectoId!, dataConId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Actualización exitosa', resp);
          Swal.fire({
            icon: 'success',
            title: 'Proyecto actualizado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            background: '#1E293B',
            color: '#ffff'
          });
          this.dialogRef.close({ accion: 'editar', data: resp });
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error al actualizar',
            text: err?.error?.message || 'Intente nuevamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 5000,
            background: '#1E293B',
            color: '#ffff'
          });
        }
      });
  }

  cerrar(): void {
    if (this.proyectoForm.dirty) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Los cambios no guardados se perderán',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00049E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Cancelar',
        background: '#ffff',
        color: '#5a5a5a'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  guardar(): void {
    this.registrar();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerMensajeError(nombreCampo: string): string {
    const control = this.proyectoForm.get(nombreCampo);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    return '';
  }
  tieneError(nombreCampo: string): boolean {
    const control = this.proyectoForm.get(nombreCampo);
    return !!(control?.invalid && (control?.dirty || control?.touched || this.submitted));
  }
}
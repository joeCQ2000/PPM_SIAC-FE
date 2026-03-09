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
import { egreso } from 'src/app/core/models/egreso.model';
import { EgresoService } from 'src/app/core/services/egreso.service';

@Component({
  selector: 'app-modal-proyecto',
  templateUrl: './modelcreaedita-egreso.component.html',
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
export class ModelEgresoComponent implements OnDestroy {
  egresoFrom: FormGroup;
  submitted = false;
  egreso: egreso[] = [];
  
  // Propiedades para controlar el modo
  modoEdicion: boolean = false;
  tituloModal: string = 'Crear Proyecto';
  egresoId?: number;
  tipoMoneda =[
    {valor:'SOLES',etiqueta:'SOLES'},
    {valor:'DOLARES',etiqueta:'DOLARES'}

  ]
   tiposDocumento = [
    { valor: 'PROVISION', etiqueta: 'PROVISIÓN' },
    { valor: 'RECIBO POR HONORARIOS', etiqueta: 'RECIBO POR HONORARIOS' },
    { valor: 'DEUDA', etiqueta: 'DEUDA' }
  ];
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ModelEgresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private egresoService: EgresoService,
    private router: Router
  ) {
    // Inicializar formulario
    this.egresoFrom = this.fb.group({
      id_proyecto : ['', Validators.required],
      tipo_documento: ['', Validators.required],
      valor_venta: [''],
      linea: [''],
      fecha_emision: [''],
      fecha_vencimiento: [null],
      numero :[''],
      recurso:[''],
      tasa_cambio:[''],
      moneda:[''],
      //fecha_registro: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      observacion: [''],
      estado:[true]
    });
    this.configurarModoEdicion();
  }

  private configurarModoEdicion(): void {
    if (this.data?.modo === 'editar' && this.data?.proyecto) {
      this.modoEdicion = true;
      this.tituloModal = 'Editar Egreso';
      this.egresoId = this.data.egreso.id;

      this.egresoFrom.patchValue({
        id_egreso: this.data.egreso.id_egreso,
        tipo_documento: this.data.egreso.tipo_documento,
        afect_impuestos: this.data.egreso.afect_impuestos ?? false,
        valor_venta: this.data.egreso.valor_venta,
        observacion: this.data.egreso.observacion || '',
        impuesto: this.data.egreso.impuesto || '',
        recurso: this.data.egreso.recurso || '',
        fecha_inicio: this.data.egreso.fecha_inicio || '',
        numero: this.data.egreso.numero || '',
        estado : this.data.egreso.estado ?? true,
      });
     
    } else {
      this.modoEdicion = false;
      this.tituloModal = 'Crear Egreso';
    }
  }

  registrar(): void {
    this.submitted = true;

    if (this.egresoFrom.invalid) {
      this.egresoFrom.markAllAsTouched();
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
    const proyectoData = this.egresoFrom.getRawValue();

    if (this.modoEdicion && this.egresoId) {
      // Modo edición
      this.actualizarProyecto(proyectoData);
    } else {
      // Modo creación
      this.crearProyecto(proyectoData);
    }
  }

  private crearProyecto(egresoData: any): void {
    this.egresoService.Registrar(egresoData)
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
    // Agregar el ID al objeto de datos};

    this.egresoService.Actualizar(this.egresoId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Actualización exitosa', resp);
          Swal.fire({
            icon: 'success',
            title: 'Egreso actualizado correctamente',
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
    if (this.egresoFrom.dirty) {
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
    const control = this.egresoFrom.get(nombreCampo);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    return '';
  }
  tieneError(nombreCampo: string): boolean {
    const control = this.egresoFrom.get(nombreCampo);
    return !!(control?.invalid && (control?.dirty || control?.touched || this.submitted));
  }
}
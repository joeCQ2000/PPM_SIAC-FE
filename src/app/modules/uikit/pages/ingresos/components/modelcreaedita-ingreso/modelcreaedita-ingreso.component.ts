import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Proyecto } from 'src/app/core/models/proyecto.model';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { IngresoService } from 'src/app/core/services/ingreso.service';
import { ingreso } from 'src/app/core/models/ingreso.model';

@Component({
  selector: 'app-modal-ingreso',
  templateUrl: './modelcreaedita-ingreso.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
]
})
export class ModelIngresoComponent implements OnDestroy {
  ingresoForm: FormGroup;
  submitted = false;
  ingreso: ingreso[] = [];
  
  // Propiedades para controlar el modo
  modoEdicion: boolean = false;
  tituloModal: string = 'Crear Proyecto';
  ingresoid?: number;
  tipoMoneda =[
    {valor:'SOLES',etiqueta:'SOLES'},
    {valor:'DOLARES',etiqueta:'DOLARES'}

  ]
  tiposDocumento = [
    { valor: 'PROVISION', etiqueta: 'PROVISIÓN' },
    { valor: 'FACTURA', etiqueta: 'FACTURA' },
    { valor: 'DEUDA', etiqueta: 'DEUDA' }
  ];
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ModelIngresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ingresoservice: IngresoService,
    private router: Router
  ) {
    this.ingresoForm = this.fb.group({
      id_proyecto : ['', Validators.required],
      tipo_documento: ['', Validators.required],
      afect_impuestos: [false],
      tasa_cambio: [''],
      moneda: ['', Validators.required],
      valor_venta: [''],
      fecha_emision: ['', Validators.required],
      fecha_vencimiento: [''],
      impuesto:[0],
      total_documento: [''],
      linea: ['', Validators.required],
      //fecha_registro: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      observacion: [''],
      estado:[true]
    });
     if (this.data?.idProyecto) {
    console.log('🎯 ID Proyecto recibido:', this.data.idProyecto);
    this.ingresoForm.patchValue({
      id_proyecto: this.data.idProyecto
    });
  }
    this.configurarModoEdicion();
  }

  private configurarModoEdicion(): void {
    if (this.data?.modo === 'editar' && this.data?.ingreso) {
      this.modoEdicion = true;
      this.tituloModal = 'Editar Ingreso';
      this.ingresoid = this.data.ingreso.id;

      this.ingresoForm.patchValue({
        id_proyecto: this.data.ingreso.nro_contrato,
        tipo_documento: this.data.ingreso.tipo_documento,
        afect_impuestos: this.data.ingreso.afect_impuestos ?? false,
        tasa_cambio: this.data.ingreso.tasa_cambio,
        valor_venta: this.data.ingreso.valor_venta || '',
        impuesto: this.data.ingreso.impuesto || '',
        observacion: this.data.ingreso.observacion || '',
        fecha_emision: this.data.ingreso.fecha_emision || '',
        fecha_vencimiento: this.data.ingreso.fecha_vencimiento || '',
        total_documento: this.data.ingreso.total_documento || '',
        estado: this.data.ingreso.estado ?? false,
      });
      if (this.data.ingreso.fecha_registro) {
        this.ingresoForm.patchValue({
          fecha_registro: this.data.ingreso.fecha_registro
        });
      }
    } else {
      this.modoEdicion = false;
      this.tituloModal = 'Crear Ingreso';
    }
  }

  registrar(): void {
    this.submitted = true;

    if (this.ingresoForm.invalid) {
      this.ingresoForm.markAllAsTouched();
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
    const ingresoData = this.ingresoForm.getRawValue();

    if (this.modoEdicion && this.ingresoid) {
      // Modo edición
      this.actualizarIngreso(ingresoData);
    } else {
      // Modo creación
      this.crearIngreso(ingresoData);
    }
  }

 private crearIngreso(ingresoData: any): void {
  // 🔥 ASEGÚRATE DE QUE TENGA EL ID DEL PROYECTO
  if (this.data?.idProyecto) {
    ingresoData.id_proyecto = this.data.idProyecto;
  }

  console.log('📤 Enviando datos:', ingresoData); // 🔥 LOG DE DEPURACIÓN

  this.ingresoservice.Registrar(ingresoData)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        console.log('✅ Registro exitoso', resp);
        
        Swal.fire({
          icon: 'success',
          title: 'Ingreso registrado correctamente',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
          background: '#1E293B',
          color: '#ffff'
        });
        
        // 🔥 CIERRE CORRECTO
        console.log('🚪 Cerrando modal con:', { accion: 'crear', data: resp });
        this.dialogRef.close({ accion: 'crear', data: resp });
      },
      error: (err) => {
        console.error('❌ Error al registrar', err);
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
  private actualizarIngreso(ingresoData: any): void {
    // Agregar el ID al objeto de datos
    this.ingresoservice.Actualizar(this.ingresoid!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Actualización exitosa', resp);
          Swal.fire({
            icon: 'success',
            title: 'Ingreso actualizado correctamente',
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
    if (this.ingresoForm.dirty) {
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
    const control = this.ingresoForm.get(nombreCampo);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    return '';
  }
  tieneError(nombreCampo: string): boolean {
    const control = this.ingresoForm.get(nombreCampo);
    return !!(control?.invalid && (control?.dirty || control?.touched || this.submitted));
  }
}
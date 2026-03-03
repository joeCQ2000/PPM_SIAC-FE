import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ← CAMBIAR BrowserModule por CommonModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; // ← AGREGAR para los botones
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
export class ModelProyectoComponent {
  proyectoForm: FormGroup;
  submitted = false ;
  proyecto : Proyecto[] =[];

   private destroy$ = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<ModelProyectoComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private proyectoservice: ProyectoService,
    private router: Router
  )
  {

    this.proyectoForm = this.fb.group({
      nro_contrato: ['', Validators.required],
      per: ['', Validators.required],
      estado: [true],
      id_cliente: ['',Validators.required],
      centro_costo: [''],
      servicio : [''],
      responsable: [''],
      fecha_inicio: [''],
      fecha_registro: [{value : new Date().toISOString().split('T')[0], disabled : true}],
      descripcion : ['']
    });

    if (data?.modo === 'editar' && data?.proyecto) {
      this.proyectoForm.patchValue(data.proyecto);
    }
    
  }
  
  registrar(): void {
      this.submitted = true;
      const proyectoData = this.proyectoForm.value
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
      else {
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
                    timer: 10000,
                    background: '#1E293B',
                    color: '#ffff'
                  });
                     this.dialogRef.close(resp);
                },
                error: (err) => {
                  console.error('Error al registrar', err);
                  Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error en el registrado',
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
      
    }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.proyectoForm.valid) {
      this.dialogRef.close(this.proyectoForm.value);
    }
  }
}
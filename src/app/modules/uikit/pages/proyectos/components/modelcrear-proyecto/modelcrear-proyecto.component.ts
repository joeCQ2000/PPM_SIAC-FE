import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ← CAMBIAR BrowserModule por CommonModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; // ← AGREGAR para los botones

@Component({
  selector: 'app-modal-proyecto',
  templateUrl: './modelcrear-proyecto.component.html',
  standalone: true,
  imports: [
    CommonModule,           // ← CAMBIAR aquí
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule         // ← AGREGAR
  ]
})
export class ModelProyectoComponent {
  formulario: FormGroup;
  titulo: string;

  constructor(
    public dialogRef: MatDialogRef<ModelProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.titulo = data?.modo === 'crear' ? 'Crear Proyecto' : 'Editar Proyecto';
    
    this.formulario = this.fb.group({
      nombreNIF: ['', Validators.required],
      responsable: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      estado: ['Activo/Inactivo'],
      centroCostos: [''],
      cliente: [''],
      descripcion: ['']
    });

    if (data?.modo === 'editar' && data?.proyecto) {
      this.formulario.patchValue(data.proyecto);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.formulario.valid) {
      this.dialogRef.close(this.formulario.value);
    }
  }
}
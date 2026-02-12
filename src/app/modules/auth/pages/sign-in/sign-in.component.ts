import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from 'src/app/core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule, ReactiveFormsModule, AngularSvgIconModule, NgIf, ButtonComponent],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly auth : AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_usuario: ['', Validators.required], 
      clave: ['', Validators.required],        
    });
    
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }


 onSubmit() {
  this.submitted = true;
  if (this.form.invalid) return;

  const { nombre_usuario, clave } = this.form.value;

  Swal.fire({
    title: 'Verificando...',
    text: 'Espere un momento',
    didOpen: () => Swal.showLoading(),
    allowOutsideClick: false,
  });

  this.auth.Login(nombre_usuario, clave).subscribe({
    next: () => {
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        timer: 1800,
        toast : true,
        showConfirmButton: false,
        position: 'top-end',
      });

      localStorage.setItem('loggedIn', 'true');

      this.router.navigate(['/components/table'], { replaceUrl: true });
    },
    error: (err) => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.mensaje || 'Credenciales inválidas',
        confirmButtonColor: '#d33',
      });
    }
  });
}
}

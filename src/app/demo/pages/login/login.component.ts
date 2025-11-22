import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  titleSpinner: string = 'Autenticando...';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarSesion: [false]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onLogin() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.spinner.show();

    const loginData = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.loginService.loginUsuario(loginData).subscribe({
      next: (response) => {
  this.authService.login(response);   // <-- ESTA ES LA CLAVE

  this.spinner.hide();
  this.isLoading = false;

  Swal.fire({
    title: 'Éxito',
    text: 'Inicio de sesión exitoso',
    icon: 'success'
  }).then(() => {
    this.router.navigate(['/inicio']);
  });
},
      error: () => {
        this.spinner.hide();
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Ups! Algo salió mal durante el inicio de sesión.',
          icon: 'error'
        });
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
    Swal.fire({
      title: 'Error',
      text: 'Por favor complete todos los campos requeridos',
      icon: 'error'
    });
  }
}


  onForgotPassword(event: Event) {
  event.preventDefault();

  Swal.fire({
    title: 'Recuperar contraseña',
    text: 'Ingrese su correo electrónico para enviar una contraseña temporal',
    input: 'email',
    inputAttributes: {
      autocapitalize: 'off',
      placeholder: 'correo@ejemplo.com'
    },
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      if (!email) {
        Swal.showValidationMessage('El correo electrónico es requerido');
        return false;
      }

      // *** Aquí sí llamamos al backend ***
      return this.authService.recuperarContrasena(email).toPromise()
        .then((resp) => {
          return resp;
        })
        .catch((err) => {
          Swal.showValidationMessage(
            `Error enviando la solicitud: ${err.error?.mensaje || 'Error desconocido'}`
          );
          return false;
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Correo enviado',
        text: 'Si el usuario existe, se ha enviado un correo con instrucciones.',
        icon: 'success'
      });
    }
  });
}

}

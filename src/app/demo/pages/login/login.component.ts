import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';

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
    private readonly router: Router
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

      // Simular llamada al servicio de autenticación
      const loginData = {
        username: this.f['username'].value,
        password: this.f['password'].value,
        recordarSesion: this.f['recordarSesion'].value
      };

      console.log('Datos de login:', loginData);
      this.loginService.loginUsuario(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          localStorage.setItem("token", response.token)
          this.isLoading = false;
          this.spinner.hide();
          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success'
          }).then(() => {
            // Aquí redirigirías al usuario al dashboard
            console.log('Redirigir al dashboard');
            this.isLoading = false;
            this.router.navigate(['/inicio']);
          });
        },
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Ups! Algo salió mal durante el inicio de sesión.',
            icon: 'error'
          });
        }
      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      // Marcar todos los campos como tocados para mostrar errores
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
      text: 'Ingrese su correo electrónico para recuperar su contraseña',
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

        // Simular envío de email de recuperación
        return new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log('Enviar email de recuperación a:', email);
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Email enviado',
          text: 'Se ha enviado un enlace de recuperación a su correo electrónico',
          icon: 'success'
        });
      }
    });
  }
}

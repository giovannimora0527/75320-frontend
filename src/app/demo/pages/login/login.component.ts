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
  
  // NUEVOS: Para mostrar mensajes de error
  mensajeError: string = '';
  intentosRestantes: number | null = null;
  cuentaBloqueada: boolean = false;

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
    // Limpiar mensajes anteriores
    this.mensajeError = '';
    this.intentosRestantes = null;
    this.cuentaBloqueada = false;

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const loginData = {
        username: this.f['username'].value,
        password: this.f['password'].value
      };

      this.loginService.loginUsuario(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          localStorage.setItem("token", response.token);
          this.isLoading = false;
          this.spinner.hide();
          
          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        },
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);
          
          // Extraer mensaje de error del backend
          let errorMessage = 'Usuario o contraseña incorrectos';
          
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          // Detectar si es cuenta bloqueada
          if (errorMessage.includes('bloqueada') || errorMessage.includes('Bloqueada')) {
            this.cuentaBloqueada = true;
            this.mensajeError = errorMessage;
            
            Swal.fire({
              title: '⛔ Cuenta Bloqueada',
              html: `<p class="text-danger">${errorMessage}</p>`,
              icon: 'error',
              confirmButtonText: 'Entendido'
            });
          } 
          // Detectar si hay intentos restantes
          else if (errorMessage.includes('Intentos restantes') || errorMessage.includes('restantes')) {
            // Extraer número de intentos si está en el mensaje
            const match = errorMessage.match(/(\d+)/);
            if (match) {
              this.intentosRestantes = parseInt(match[0]);
            }
            this.mensajeError = errorMessage;
            
            Swal.fire({
              title: '⚠️ Contraseña Incorrecta',
              html: `
                <p>${errorMessage}</p>
                ${this.intentosRestantes ? `<p class="text-warning mt-2"><strong>Intentos restantes: ${this.intentosRestantes}</strong></p>` : ''}
              `,
              icon: 'warning',
              confirmButtonText: 'Reintentar'
            });
          } 
          // Error genérico
          else {
            this.mensajeError = errorMessage;
            
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'Reintentar'
            });
          }
        }
      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      this.loginForm.markAllAsTouched();
      
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });
    }
  }
  onForgotPassword(event: Event): void {
  event.preventDefault();
  this.router.navigate(['/recuperar-password']);
}


}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../usuario/models/usuario';
//Importaciones de Recuperar contraseña
import { RecuperarPasswordRq } from './models/password-rq';
import { RespuestaRs } from './models/respuesta-rs';

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
    private service: LoginService,
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
        password: this.f['password'].value,
        recordarSesion: this.f['recordarSesion'].value
      };

      this.loginService.loginUsuario(loginData).subscribe({
        next: (response) => {
          try {
            const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
            const username = tokenPayload.sub || tokenPayload.username;
            const rol = tokenPayload.rol || 'USER';
            
            const usuario: Usuario = {
              id: 0,
              username: username,
              email: tokenPayload.correo || '',
              rol: rol,
              fechaCreacion: new Date(),
              activo: true 
            };
            
            this.authService.login(response, usuario);
            
            this.isLoading = false;
            this.spinner.hide();
            
            setTimeout(() => {
              Swal.fire({
                title: 'Éxito',
                text: 'Inicio de sesión exitoso',
                icon: 'success'
              }).then(() => {
                this.router.navigate(['/inicio']);
              });
            }, 100);
          } catch (error) {
            console.error('Error al decodificar:', error);
            this.authService.login(response);
            this.isLoading = false;
            this.spinner.hide();
            this.router.navigate(['/inicio']);
          }
        },
        
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);
          
          // Extraer el mensaje de error del response usando RespuestaRs
          const errorMessage = error.error?.mensaje 
            ? error.error.mensaje 
            : error.error?.message || 'Ups! Algo salió mal durante el inicio de sesión.';

          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error'
          });
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

  onForgotPassword(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: 'Recuperar contraseña',
      text: 'Ingrese su nombre de usuario para recuperar su contraseña',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Nombre de usuario'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,

/**
 * Lógica de interceptación antes de la confirmación (`preConfirm`).
 * * Se ejecuta al pulsar el botón de "Aceptar" en el modal.
 *
 * Flujo de Ejecución:
 * 1. **Validación Local**: Verifica que el username no esté vacío y cumpla la longitud mínima.
 * 2. **Llamada al Servicio**: Realiza la petición HTTP para verificar el email.
 * 3. **Manejo de Errores**: Si el servicio falla, captura la excepción, muestra el mensaje dentro del propio modal
 * y retorna `false` para impedir que se cierre.
 *
 * @param {string} username - El valor capturado del input del modal.
 * @returns {Promise<RespuestaRs | boolean>} Promesa que resuelve con la respuesta del backend o false si falla.
 */
preConfirm: (username) => {
  // 1. Validaciones Síncronas de entrada
  if (!username) {
    Swal.showValidationMessage('El nombre de usuario es requerido');
    return false;
  }

  if (username.length < 3) {
    Swal.showValidationMessage('El nombre de usuario debe tener al menos 3 caracteres');
    return false;
  }

  // 2. Preparación de la solicitud
  const request: RecuperarPasswordRq = {
    username: username
  };

  // 3. Conversión de Observable a Promise para compatibilidad con SweetAlert
  return this.service.testEmail(request).toPromise()
    .then((response: RespuestaRs) => {
      // Éxito: Pasamos la respuesta completa al siguiente bloque (.then del Swal)
      return response;
    })
    .catch((err) => {
      // Error: Jerarquía de extracción del mensaje de error (Backend > Genérico > Default)
      const errorMsg = err?.error?.mensaje || err?.error?.message || err?.message || 'Error inesperado';
      
      // Inyectamos el error visualmente en el modal sin cerrarlo
      Swal.showValidationMessage(`Error enviando la solicitud: ${errorMsg}`);
      return false; // Mantiene el modal abierto
    });
},

/**
 * Bloquea la interacción externa mientras la petición está en curso (loading).
 * Evita que el usuario cierre el modal accidentalmente mientras espera al backend.
 */
allowOutsideClick: () => !Swal.isLoading()

}).then((result) => {
  /**
   * Bloque de resolución final.
   * Se ejecuta solo si `preConfirm` resolvió exitosamente (no retornó false).
   */
  if (result.isConfirmed && result.value) {
    // Extracción del mensaje de éxito proveniente del backend (pasado por el return del then anterior)
    const mensajeExito = result.value.mensaje || 'Se ha procesado su solicitud de recuperación de contraseña';

    Swal.fire({
      title: 'Solicitud enviada',
      text: mensajeExito,
      icon: 'success'
    });
  }
});
}
}
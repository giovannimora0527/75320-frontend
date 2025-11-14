import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { RecuperarPasswordService } from './service/recuperar-password.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../usuario/models/usuario';
import { firstValueFrom } from 'rxjs';

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
    private readonly recuperarPasswordService: RecuperarPasswordService,
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
          
          // Decodificar el token para obtener información del usuario
          try {
            const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
            const username = tokenPayload.sub || tokenPayload.username;
            const rol = tokenPayload.rol || 'USER';
            
            // Crear un objeto usuario con la información del token
            const usuario: Usuario = {
              id: 0,
              username: username,
              email: tokenPayload.correo || '',
              rol: rol,
              fechaCreacion: new Date(),
              activo: true
            };
            
            // Usar el AuthService para guardar la sesión correctamente
            this.authService.login(response, usuario);
            
            // Verificar que la autenticación se guardó correctamente
            console.log('Después de login - isAuthenticated:', this.authService.isAuthenticated());
            console.log('Token en localStorage:', localStorage.getItem('token'));
            
            this.isLoading = false;
            this.spinner.hide();
            
            // Pequeño delay para asegurar que el estado se actualice
            setTimeout(() => {
              console.log('Verificación final - isAuthenticated:', this.authService.isAuthenticated());
              Swal.fire({
                title: 'Éxito',
                text: 'Inicio de sesión exitoso',
                icon: 'success'
              }).then(() => {
                console.log('Redirigir al dashboard');
                this.router.navigate(['/inicio']).then(() => {
                  console.log('Navegación completada');
                }).catch(err => {
                  console.error('Error en navegación:', err);
                });
              });
            }, 100);
          } catch (error) {
            console.error('Error al decodificar el token:', error);
            // Si hay error al decodificar, aún así guardar el token
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
          const errorMessage = error?.error?.message || error?.error?.mensaje || error?.message || 'Usuario o contraseña incorrectos';
          Swal.fire({
            title: 'Error de autenticación',
            text: errorMessage,
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
      html: `
        <p>Ingrese su <strong>nombre de usuario</strong> para recuperar su contraseña.</p>
        <p class="text-muted" style="font-size: 0.9em;">
          <i class="fa fa-info-circle"></i>
          Se enviará una contraseña temporal al correo electrónico registrado.
        </p>
      `,
      input: 'text',
      inputLabel: 'Nombre de usuario',
      inputPlaceholder: 'Ingrese su nombre de usuario',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value || value.trim().length < 3) {
          return 'El nombre de usuario es requerido (mínimo 3 caracteres)';
        }
        return null;
      },
      preConfirm: (username) => {
        if (!username || username.trim().length < 3) {
          Swal.showValidationMessage('El nombre de usuario es requerido');
          return false;
        }

        // Llamar al servicio de recuperación de contraseña
        return firstValueFrom(this.recuperarPasswordService.recuperarPassword(username.trim()))
          .then((response) => {
            return response;
          })
          .catch((error) => {
            // Por seguridad, siempre mostrar el mismo mensaje genérico
            return {
              mensaje: 'Si el usuario existe y tiene un correo electrónico registrado, se enviará una contraseña temporal.',
              status: 200,
              success: true
            };
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const response = result.value;
        Swal.fire({
          title: 'Solicitud procesada',
          html: `
            <p>${response.mensaje || 'Si el usuario existe y tiene un correo electrónico registrado, se enviará una contraseña temporal.'}</p>
            <hr>
            <p class="text-muted" style="font-size: 0.9em;">
              <i class="fa fa-shield-alt"></i>
              Por seguridad, no se revela si el usuario existe o no en el sistema.
            </p>
            <p class="text-muted" style="font-size: 0.85em; margin-top: 10px;">
              <strong>Nota:</strong> Si no recibes el correo, verifica tu carpeta de spam o contacta al administrador.
            </p>
          `,
          icon: 'info',
          confirmButtonText: 'Entendido',
          width: '500px'
        });
      }
    });
  }
}

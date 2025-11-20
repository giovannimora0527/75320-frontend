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
            : 'Ups! Algo salió mal durante el inicio de sesión.';

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

      preConfirm: (username) => {
        if (!username) {
          Swal.showValidationMessage('El nombre de usuario es requerido');
          return false;
        }

        const request: RecuperarPasswordRq = {
          username: username
        };

        return this.service.testEmail(request).toPromise()
          .then((response: RespuestaRs) => {
            // Retornamos el mensaje del backend para usarlo en el then
            return response;
          })
          .catch((err) => {
            Swal.showValidationMessage(
              'Error enviando la solicitud: ' + (err?.error?.mensaje || err?.message || 'Error inesperado')
            );
            return false;
          });
      },

      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Usamos el mensaje del backend desde result.value.mensaje
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
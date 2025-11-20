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
            
            // Asegúrate de que la interfaz Usuario importada tenga 'username'
            const usuario: Usuario = {
              id: 0,
              username: username, // Si esto marca error, revisa tu interfaz Usuario
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
        }, // <--- ¡AQUÍ FALTABA LA LLAVE Y LA COMA!
        
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ups! Algo salió mal durante el inicio de sesión.',
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

    // 👇 Creamos el request con tu modelo RecuperarPasswordRq
    const request: RecuperarPasswordRq = {
      username: email
    };

    return this.service.testEmail(request).toPromise()
      .catch((err) => {
        Swal.showValidationMessage(
          'Error enviando el correo: ' + (err?.message || 'Error inesperado')
        );
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

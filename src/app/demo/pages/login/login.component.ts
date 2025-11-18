import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
  import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRq } from './models/login-rq';
import { LoginRs } from './models/login-rs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule
  ],
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
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.inicializarFormulario();
  }

  private inicializarFormulario(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarSesion: [false]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });

      return;
    }

    this.isLoading = true;
    this.titleSpinner = 'Autenticando...';
    this.spinner.show();

    const payload: LoginRq = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.loginService.autenticar(payload).subscribe({
      next: (data: LoginRs) => {
        this.spinner.hide();
        this.isLoading = false;

        this.authService.login(data);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6c5ce7'
        }).then(() => {
          this.router.navigate(['/inicio/cita']);
        });
      },
      error: (err) => {
        this.spinner.hide();
        this.isLoading = false;

        let mensaje = 'Error al iniciar sesión';

        if (err?.error) {
          if (typeof err.error === 'string') {
            mensaje = err.error;
          } else if (err.error?.message) {
            mensaje = err.error.message;
          } else if (err.error?.mensaje) {
            mensaje = err.error.mensaje;
          }
        } else if (err?.message) {
          mensaje = err.message;
        }

        // FORMATEAMOS EL BLOQUEO
        if (mensaje.includes('Usuario bloqueado hasta')) {
          const fechaStr = mensaje.replace('Usuario bloqueado hasta ', '').trim();
          const fecha = new Date(fechaStr);

          const opcionesFecha: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          };

          const fechaBonita = fecha.toLocaleDateString('es-CO', opcionesFecha);

          const opcionesHora: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          };

          const horaBonita = fecha.toLocaleTimeString('es-CO', opcionesHora);

          Swal.fire({
            icon: 'warning',
            title: 'Cuenta bloqueada temporalmente',
            html: `
              <p><b>Tu cuenta fue bloqueada por seguridad.</b></p>
              <p>Podrás volver a intentarlo:</p>
              <p style="font-size: 18px; margin-top: 10px;">
                📅 <b>${fechaBonita}</b><br>
                🕒 <b>${horaBonita}</b>
              </p>
            `,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#6c5ce7'
          });

          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje
        });
      }
    });
  }
}

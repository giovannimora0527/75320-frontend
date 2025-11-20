// src/app/demo/pages/recuperar-password/recuperar-password.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from '../login/service/login.service';
import { RecuperacionPasswordRq } from '../login/models/recuperacion-password-rq';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {
  recuperarForm: FormGroup;
  isLoading: boolean = false;
  titleSpinner: string = 'Procesando solicitud...';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  inicializarFormulario() {
    this.recuperarForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.recuperarForm.controls;
  }

  /**
   * Procesa la solicitud de recuperación de contraseña
   */
  onRecuperar(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor, ingresa tu nombre de usuario', 'warning');
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    const recuperacionData: RecuperacionPasswordRq = {
      username: this.f['username'].value.trim()
    };

    this.loginService.recuperarPassword(recuperacionData).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.isLoading = false;

        Swal.fire({
          title: 'Solicitud Procesada',
          text: response.mensaje,
          icon: 'success',
          confirmButtonText: 'Ir al Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.spinner.hide();
        this.isLoading = false;
        
        console.error('Error al recuperar contraseña:', error);
        Swal.fire('Error', 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.', 'error');
      }
    });
  }

  /**
   * Vuelve a la página de login
   */
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}
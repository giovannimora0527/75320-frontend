import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';   // 👈 importa RouterModule
import Swal from 'sweetalert2';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    RouterModule                 // 👈 agrega RouterModule aquí
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent {

  form: FormGroup;
  isLoading = false;
  titleSpinner = 'Procesando solicitud...';

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    const username = this.f['username'].value;

    this.loginService.recuperarContrasena(username).subscribe({
      next: () => {
        this.spinner.hide();
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'Si el usuario existe, recibirá un correo con una contraseña temporal.'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        this.spinner.hide();
        this.isLoading = false;

        Swal.fire({
          icon: 'info',
          title: 'Solicitud procesada',
          text: 'Si el usuario existe en el sistema, se enviará un correo.'
        });
      }
    });
  }
}
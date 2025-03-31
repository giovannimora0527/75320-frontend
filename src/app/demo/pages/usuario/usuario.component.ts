import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;

  form: FormGroup = new FormGroup({
    nombreCompleto: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal() {
    const modalElement = document.getElementById('crearUsuarioModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}

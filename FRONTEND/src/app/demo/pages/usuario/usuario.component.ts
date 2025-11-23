import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './models/usuario';
import { CommonModule } from '@angular/common';

// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  usuarios: Usuario[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  usuarioSelected: Usuario | null = null;
  titleSpinner: string = "Cargando...";
  isLoading: boolean = false;

  form: FormGroup;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {    
    this.listarUsuarios();
    this.inicializarFormulario();    
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      activo: [true],
      password: [''] // Campo opcional: si se deja vacío, el backend genera una automática
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarUsuarios() {
    this.isLoading = true;
    this.spinner.show();
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al listar usuarios', error);
        this.isLoading = false;
        this.spinner.hide();
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al usuario "${usuario.username}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!usuario.id) {
          Swal.fire('Error', 'ID de usuario no válido', 'error');
          return;
        }
        this.isLoading = true;
        this.spinner.show();
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
          next: (resp) => {
            this.isLoading = false;
            this.spinner.hide();
            Swal.fire('Eliminado', resp.mensaje || 'Usuario eliminado correctamente', 'success');
            this.listarUsuarios();
          },
          error: (err) => {
            this.isLoading = false;
            this.spinner.hide();
            console.error('Error al eliminar usuario:', err);
            Swal.fire('Error', err.error?.message || 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearUsuario');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoUsuario() {
    this.usuarioSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.form.patchValue({
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo
    });
    this.openModal('E');
  }

  /**
   * Funcion que permite guardar/actualizar un usuario.
   */
  guardarUsuario() {
    this.titleSpinner = this.modoFormulario === 'C' ? "Creando usuario..." : "Actualizando usuario...";
    this.spinner.show();   
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
        next: (data) => {          
          if (data.status === 200 || data.status === 201) {
            this.spinner.hide();
            
            // Extraer la contraseña de la respuesta si está disponible
            let password = '';
            if (data.data && typeof data.data === 'object' && 'password' in data.data) {
              password = (data.data as any).password;
            }
            
            // Mostrar la contraseña al usuario
            if (password) {
              Swal.fire({
                title: 'Usuario creado exitosamente',
                html: `
                  <p>${data.mensaje}</p>
                  <hr>
                  <p><strong>Credenciales del usuario:</strong></p>
                  <p><strong>Username:</strong> ${this.form.get('username')?.value}</p>
                  <p><strong>Contraseña:</strong> <code style="background: #f0f0f0; padding: 5px; border-radius: 3px; font-size: 18px;">${password}</code></p>
                  <p class="text-muted"><small>Guarda esta información de forma segura</small></p>
                `,
                icon: 'success',
                confirmButtonText: 'Copiar contraseña',
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
                width: '500px'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Copiar contraseña al portapapeles
                  navigator.clipboard.writeText(password).then(() => {
                    Swal.fire('Copiado', 'La contraseña ha sido copiada al portapapeles', 'info');
                  });
                }
                this.closeModal();
                this.listarUsuarios();
              });
            } else {
              Swal.fire('Éxito', data.mensaje, 'success');
              this.closeModal();
              this.listarUsuarios();
            }
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje || 'Ocurrió un error al crear el usuario', 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error completo:', error);
          const errorMessage = error?.error?.mensaje || error?.error?.message || error?.message || 'Ocurrió un error al crear el usuario';
          Swal.fire('Error', errorMessage, 'error');
        }
      });
    } else {
      // Modo Edición
      const usuarioActualizado: Usuario = this.form.getRawValue();
      usuarioActualizado.id = this.usuarioSelected!.id;
      this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
        next: (data) => {       
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarUsuarios();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();          
          Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar el usuario', 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      username: this.usuarioSelected ? this.usuarioSelected.username : '',
      email: this.usuarioSelected ? this.usuarioSelected.email : '',
      rol: this.usuarioSelected ? this.usuarioSelected.rol : '',
      activo: this.usuarioSelected ? this.usuarioSelected.activo : false
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
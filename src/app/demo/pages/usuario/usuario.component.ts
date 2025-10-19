import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: [''],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordAsyncValidator]],
      rol: ['', [Validators.required]],
      activo: [true]
    });
  }

  passwordAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const contrasenasProhibidas = ['123456', 'password', 'admin'];

    return of(contrasenasProhibidas.includes(control.value)).pipe(
      delay(800),
      map((invalida) => (invalida ? { passwordProhibida: true } : null))
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarUsuarios() {
    console.log('Iniciando carga de usuarios...');
    this.isLoading = true;
    
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.usuarios = data;
          console.log('Usuarios cargados:', this.usuarios);
          this.isLoading = false;
        }, 800);
      },
      error: (err) => {
        console.error('Error al listar usuarios:', err);
        setTimeout(() => {
          this.isLoading = false;
          Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }, 800);
      }
    });
  }

  guardarUsuario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.form.get('activo')?.setValue(true);
      
      this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log('Usuario guardado:', data);
          Swal.fire('Éxito', data.message || 'Usuario creado correctamente', 'success');
          this.listarUsuarios();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al guardar usuario:', err);
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el usuario', 'error');
        }
      });
    } else {
      // Modo Edición
      const usuarioActualizar = this.form.getRawValue();
  const idUsuario = usuarioActualizar.id; // AGREGAR ESTO
  
  this.usuarioService.actualizarUsuario(idUsuario, usuarioActualizar).subscribe({ // CAMBIAR ESTO
    next: (data) => {
      console.log('Usuario actualizado:', data);
      Swal.fire('Éxito', data.message || 'Usuario actualizado correctamente', 'success');
      this.listarUsuarios();
      this.closeModal();
    },
    error: (err) => {
      console.error('Error al actualizar usuario:', err);
      Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar el usuario', 'error');
    }
      });
    }
  }

  eliminarUsuario(usuario: Usuario) {
    console.log('MÉTODO ELIMINAR EJECUTADO', usuario); // DEBUG
    
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
  
        console.log('Intentando eliminar usuario con ID:', usuario.id); // DEBUG
  
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
          next: (resp) => {
            console.log('Respuesta de eliminación:', resp); // DEBUG
            Swal.fire('Eliminado', resp.message || 'Usuario eliminado correctamente', 'success');
            this.listarUsuarios();
          },
          error: (err) => {
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
      this.limpiarFormulario();
    }
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
    this.limpiarFormulario();
    
    // Cargar datos del usuario en el formulario
    this.form.patchValue({
      id: usuario.id,
      username: usuario.username,
      password: '', // No cargar la contraseña por seguridad
      rol: usuario.rol,
      activo: usuario.activo
    });
    
    // En modo edición, hacer el password opcional
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.setValidators([Validators.minLength(8)]);
    this.form.get('password')?.updateValueAndValidity();
    
    this.openModal('E');
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      id: '',
      username: '',
      password: '',
      rol: '',
      activo: true
    });
    
    // Restaurar validaciones originales
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('password')?.setAsyncValidators([this.passwordAsyncValidator]);
    this.form.get('password')?.updateValueAndValidity();
  }
}
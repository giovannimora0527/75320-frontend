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
// Importa los objetos necesarios de Bootstrap
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
  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
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
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordAsyncValidator]],
      rol: ['', [Validators.required]],
      activo: ['']
    });
  }

  passwordAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const contrasenasProhibidas = ['123456', 'password', 'admin'];

    return of(contrasenasProhibidas.includes(control.value)).pipe(
      delay(800), // simulamos llamada a servidor
      map((invalida) => (invalida ? { passwordProhibida: true } : null))
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Servicio de listar usuarios.
   */
  listarUsuarios() {
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => console.error('Error al listar usuarios:', err)
    });
  }

  guardarUsuario() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
          next: (data) => {
            console.log('Usuario guardado:', data);
            Swal.fire('Creación exitosa', data.message, 'success');
            this.listarUsuarios();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al guardar usuario:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el usuario.', 'error');
          }
        });
      } else {
        // Modo Edición
      }
    }
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
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoUsuario() {
    this.usuarioSelected = new Usuario();
    this.limpiarFormulario();
    // Cargamos los datos del usuario seleccionado en el formulario
    
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.openModal('E');
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      username: '',
      password: '',
      rol: '',
      activo: ''
    });
  }
}

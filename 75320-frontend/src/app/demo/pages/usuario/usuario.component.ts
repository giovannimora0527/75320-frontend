<<<<<<< HEAD
import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { CommonModule } from '@angular/common';
=======
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
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

<<<<<<< HEAD
=======
// Angular Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-usuario',
<<<<<<< HEAD
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
=======
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  usuarios: Usuario[] = [];
  dataSource = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = ['id', 'username', 'rol', 'fechaCreacion', 'activo', 'acciones'];
  titleModal: string = '';
  titleBoton: string = '';
  usuarioSelected: Usuario;
  showPassword: boolean = false;

  titleSpinner: string = "";
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
<<<<<<< HEAD
    private usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarUsuarios();
    this.cargarFormulario();
=======
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarUsuarios();
    this.cargarFormulario();   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const searchString = filter.toLowerCase();
      return data.username?.toLowerCase().includes(searchString) ||
             data.rol?.toLowerCase().includes(searchString) ||
             data.fechaCreacion?.toLowerCase().includes(searchString) ||
             data.id?.toString().includes(searchString);
    };
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
<<<<<<< HEAD
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordAsyncValidator]],
=======
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)], [this.passwordAsyncValidator]],
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
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
<<<<<<< HEAD
=======
    this.titleSpinner = "Cargando usuarios...";
    this.spinner.show();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
<<<<<<< HEAD
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => console.error('Error al listar usuarios:', err)
=======
        this.dataSource.data = data;
        this.spinner.hide();
        console.log('Usuarios cargados:', this.usuarios);
      },

      error: (err) => {
        this.spinner.hide();
        console.error('Error al listar usuarios:', err);
        Swal.fire('Error', 'Ocurrió un error al cargar los usuarios.', 'error');
      }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    });
  }

  guardarUsuario() {
<<<<<<< HEAD
=======
    this.titleSpinner = this.modoFormulario === 'C' ? "Creando usuario..." : "Actualizando usuario...";
    this.spinner.show();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
          next: (data) => {
<<<<<<< HEAD
=======
            this.spinner.hide();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
            console.log('Usuario guardado:', data);
            Swal.fire('Creación exitosa', data.message, 'success');
            this.listarUsuarios();
            this.closeModal();
          },
          error: (err) => {
<<<<<<< HEAD
=======
            this.spinner.hide();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
            console.error('Error al guardar usuario:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el usuario.', 'error');
          }
        });
      } else {
        // Modo Edición
<<<<<<< HEAD
      }
=======
        const usuarioActualizado = { ...this.usuarioSelected, ...this.form.getRawValue() };
        console.log(usuarioActualizado);
        this.usuarioService.actualizarUsuario(usuarioActualizado)
        .subscribe(
          {
            next: (data) => {    
              this.spinner.hide();         
              Swal.fire('Actualización exitosa', data.message, 'success');
              this.listarUsuarios();
              this.closeModal();
            },
            error: (error) => {
              this.spinner.hide();
              console.error('Error al actualizar usuario:', error);
              Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar el usuario.', 'error');
            } 
          }
        );
       
      }
    } else {
      this.spinner.hide();
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
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
<<<<<<< HEAD
    this.limpiarFormulario();
    // Cargamos los datos del usuario seleccionado en el formulario
    
=======
    this.limpiarFormulario();    
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
<<<<<<< HEAD
    this.usuarioSelected = usuario;
    this.openModal('E');
    this.limpiarFormulario();
=======
    this.limpiarFormulario();
    this.usuarioSelected = usuario;
    this.form.get("activo").setValue(this.usuarioSelected.activo);
    this.form.get("rol").setValue(this.usuarioSelected.rol);
    this.form.get("username").setValue(this.usuarioSelected.username);
    this.form.get("password").setValue(this.usuarioSelected.password);
    this.openModal('E');
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
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
<<<<<<< HEAD
=======

  /**
   * Aplicar filtro a la tabla de Material
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Obtener el color del chip según el rol
   */
  getRolColor(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'primary';
      case 'MEDICO': return 'accent';
      case 'PACIENTE': return 'warn';
      default: return '';
    }
  }

  /**
   * Obtener el icono según el estado
   */
  getEstadoIcon(activo: boolean): string {
    return activo ? 'check_circle' : 'cancel';
  }

  /**
   * Obtener el color del icono según el estado
   */
  getEstadoColor(activo: boolean): string {
    return activo ? 'primary' : 'warn';
  }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
}

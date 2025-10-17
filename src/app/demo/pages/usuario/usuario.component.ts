import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  usuarioSelected: Usuario;
  showPassword: boolean = false;

  titleSpinner: string = "";

  // Propiedades para DataTable
  filtroTexto: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalElementos: number = 0;
  totalPaginas: number = 0;
  ordenarPor: string = '';
  ordenDireccion: 'asc' | 'desc' = 'asc';

  // Opciones de elementos por página
  opcionesPorPagina: number[] = [5, 10, 25, 50];

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarUsuarios();
    this.cargarFormulario();   
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)], [this.passwordAsyncValidator]],
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
    this.titleSpinner = "Cargando usuarios...";
    this.spinner.show();
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltroYPaginacion();
        this.spinner.hide();
        console.log('Usuarios cargados:', this.usuarios);
      },

      error: (err) => {
        this.spinner.hide();
        console.error('Error al listar usuarios:', err);
        Swal.fire('Error', 'Ocurrió un error al cargar los usuarios.', 'error');
      }
    });
  }

  guardarUsuario() {
    this.titleSpinner = this.modoFormulario === 'C' ? "Creando usuario..." : "Actualizando usuario...";
    this.spinner.show();
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.spinner.hide();
            console.log('Usuario guardado:', data);
            Swal.fire('Creación exitosa', data.message, 'success');
            this.listarUsuarios();
            this.closeModal();
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al guardar usuario:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el usuario.', 'error');
          }
        });
      } else {
        // Modo Edición
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
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.limpiarFormulario();
    this.usuarioSelected = usuario;
    this.form.get("activo").setValue(this.usuarioSelected.activo);
    this.form.get("rol").setValue(this.usuarioSelected.rol);
    this.form.get("username").setValue(this.usuarioSelected.username);
    this.form.get("password").setValue(this.usuarioSelected.password);
    this.openModal('E');
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

  // ================= MÉTODOS PARA DATATABLE =================

  /**
   * Aplicar filtro y paginación
   */
  aplicarFiltroYPaginacion() {
    // Aplicar filtro
    if (this.filtroTexto.trim() === '') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      const filtro = this.filtroTexto.toLowerCase().trim();
      this.usuariosFiltrados = this.usuarios.filter(usuario => 
        usuario.username?.toLowerCase().includes(filtro) ||
        usuario.rol?.toLowerCase().includes(filtro) ||
        usuario.fechaCreacion?.toLowerCase().includes(filtro) ||
        usuario.id?.toString().includes(filtro)
      );
    }

    // Aplicar ordenamiento si está definido
    if (this.ordenarPor) {
      this.aplicarOrdenamiento();
    }

    // Calcular totales
    this.totalElementos = this.usuariosFiltrados.length;
    this.totalPaginas = Math.ceil(this.totalElementos / this.elementosPorPagina);
    
    // Ajustar página actual si es necesario
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
    if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }
  }

  /**
   * Aplicar ordenamiento
   */
  aplicarOrdenamiento() {
    this.usuariosFiltrados.sort((a, b) => {
      let valorA: string | number | Date;
      let valorB: string | number | Date;

      switch (this.ordenarPor) {
        case 'id':
          valorA = a.id || 0;
          valorB = b.id || 0;
          break;
        case 'username':
          valorA = (a.username || '').toLowerCase();
          valorB = (b.username || '').toLowerCase();
          break;
        case 'rol':
          valorA = (a.rol || '').toLowerCase();
          valorB = (b.rol || '').toLowerCase();
          break;
        case 'fechaCreacion':
          valorA = new Date(a.fechaCreacion || 0);
          valorB = new Date(b.fechaCreacion || 0);
          break;
        case 'activo':
          valorA = a.activo ? 1 : 0;
          valorB = b.activo ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (valorA < valorB) {
        return this.ordenDireccion === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordenDireccion === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Obtener usuarios de la página actual
   */
  get usuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  /**
   * Buscar usuarios
   */
  buscar() {
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

  /**
   * Limpiar filtro
   */
  limpiarFiltro() {
    this.filtroTexto = '';
    this.buscar();
  }

  /**
   * Ordenar por columna
   */
  ordenarPorColumna(columna: string) {
    if (this.ordenarPor === columna) {
      this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenarPor = columna;
      this.ordenDireccion = 'asc';
    }
    this.aplicarFiltroYPaginacion();
  }

  /**
   * Ir a página específica
   */
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  /**
   * Cambiar elementos por página
   */
  cambiarElementosPorPagina(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.elementosPorPagina = parseInt(target.value);
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }

  /**
   * Obtener páginas para mostrar en paginación
   */
  get paginasVisibles(): number[] {
    const paginas: number[] = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginasVisibles / 2));
    const fin = Math.min(this.totalPaginas, inicio + maxPaginasVisibles - 1);

    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < maxPaginasVisibles - 1) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  /**
   * Obtener rango de elementos mostrados
   */
  get rangoElementos(): string {
    if (this.totalElementos === 0) {
      return '0 de 0';
    }
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina + 1;
    const fin = Math.min(this.paginaActual * this.elementosPorPagina, this.totalElementos);
    return `${inicio}-${fin} de ${this.totalElementos}`;
  }

  /**
   * TrackBy function para optimizar el renderizado de la tabla
   */
  trackByUsuario(index: number, usuario: Usuario): number | undefined {
    return usuario.id;
  }
}

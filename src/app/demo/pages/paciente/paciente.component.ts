import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  modoEdicion = false;
  filtroTexto = '';
  filtroCampo = 'todos';
  
  // Formulario reactivo
  pacienteForm: FormGroup;

  // Opciones para filtros
  camposFiltro = [
    { valor: 'todos', texto: 'Todos los campos' },
    { valor: 'nombres', texto: 'Nombres' },
    { valor: 'apellidos', texto: 'Apellidos' },
    { valor: 'numeroDocumento', texto: 'Número de documento' },
    { valor: 'email', texto: 'Email' },
    { valor: 'telefono', texto: 'Teléfono' },
    { valor: 'ocupacion', texto: 'Ocupación' }
  ];

  // Opciones para selects
  tiposDocumento = ['CC', 'TI', 'CE', 'RC', 'PAS'];
  generos = ['M', 'F', 'O'];
  estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión libre'];

  constructor(
    private svc: PacienteService,
    private fb: FormBuilder
  ) {
    this.pacienteForm = this.crearFormulario();
  }

  ngOnInit() {
    this.cargarPacientes();
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      id: [null],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      ocupacion: ['', Validators.required],
      contactoEmergenciaNombre: ['', Validators.required],
      contactoEmergenciaTelefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contactoEmergenciaRelacion: ['', Validators.required],
      activo: [true],
      observaciones: ['']
    });
  }

  cargarPacientes() {
    this.svc.listar().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.pacientesFiltrados = [...data];
        console.log('Pacientes cargados:', this.pacientes.length);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
      }
    });
  }

  nuevoPaciente() {
    this.modoEdicion = false;
    this.pacienteSeleccionado = null;
    this.pacienteForm.reset();
    this.pacienteForm.patchValue({ activo: true });
  }

  editarPaciente(paciente: Paciente) {
    this.modoEdicion = true;
    this.pacienteSeleccionado = paciente;
    this.pacienteForm.patchValue(paciente);
  }

  guardarPaciente() {
    if (this.pacienteForm.invalid) {
      this.marcarCamposComoTocados();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const pacienteData = this.pacienteForm.value;
    
    if (this.modoEdicion && this.pacienteSeleccionado) {
      // Actualizar
      this.svc.actualizar(this.pacienteSeleccionado.id, pacienteData).subscribe({
        next: (pacienteActualizado) => {
          const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
          if (index !== -1) {
            this.pacientes[index] = pacienteActualizado;
            this.aplicarFiltros();
          }
          Swal.fire('Éxito', 'Paciente actualizado correctamente', 'success');
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al actualizar paciente:', error);
          Swal.fire('Error', 'No se pudo actualizar el paciente', 'error');
        }
      });
    } else {
      // Crear
      this.svc.crear(pacienteData).subscribe({
        next: (nuevoPaciente) => {
          this.pacientes.unshift(nuevoPaciente);
          this.aplicarFiltros();
          Swal.fire('Éxito', 'Paciente creado correctamente', 'success');
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al crear paciente:', error);
          Swal.fire('Error', 'No se pudo crear el paciente', 'error');
        }
      });
    }
  }

  eliminarPaciente(paciente: Paciente) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al paciente ${paciente.nombres} ${paciente.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.eliminar(paciente.id).subscribe({
          next: () => {
            this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
            this.aplicarFiltros();
            Swal.fire('Eliminado', 'El paciente ha sido eliminado', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar paciente:', error);
            Swal.fire('Error', 'No se pudo eliminar el paciente', 'error');
          }
        });
      }
    });
  }

  toggleActivo(paciente: Paciente) {
    const accion = paciente.activo ? 'desactivar' : 'activar';
    const servicio = paciente.activo ? this.svc.desactivar(paciente.id) : this.svc.activar(paciente.id);
    
    servicio.subscribe({
      next: (pacienteActualizado) => {
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) {
          this.pacientes[index] = pacienteActualizado;
          this.aplicarFiltros();
        }
        Swal.fire('Éxito', `Paciente ${accion}do correctamente`, 'success');
      },
      error: (error) => {
        console.error(`Error al ${accion} paciente:`, error);
        Swal.fire('Error', `No se pudo ${accion} el paciente`, 'error');
      }
    });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.pacienteSeleccionado = null;
    this.pacienteForm.reset();
  }

  aplicarFiltros() {
    if (!this.filtroTexto.trim()) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }

    const textoFiltro = this.filtroTexto.toLowerCase();
    
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      if (this.filtroCampo === 'todos') {
        return Object.values(paciente).some(valor => 
          valor && valor.toString().toLowerCase().includes(textoFiltro)
        );
      } else {
        const valorCampo = paciente[this.filtroCampo as keyof Paciente];
        return valorCampo && valorCampo.toString().toLowerCase().includes(textoFiltro);
      }
    });
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroCampo = 'todos';
    this.aplicarFiltros();
  }

  marcarCamposComoTocados() {
    Object.keys(this.pacienteForm.controls).forEach(key => {
      this.pacienteForm.get(key)?.markAsTouched();
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.pacienteForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.pacienteForm.get(campo);
    if (control?.errors?.['required']) return `${campo} es requerido`;
    if (control?.errors?.['email']) return 'Email inválido';
    if (control?.errors?.['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control?.errors?.['pattern']) return 'Formato inválido';
    return '';
  }

  trackByFn(index: number, item: Paciente): number {
    return item.id;
  }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent {
  // =======================
  // VARIABLES PRINCIPALES
  // =======================
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  form: FormGroup;
  filtrosForm: FormGroup;
  modalInstance: Modal | null = null;

  tituloModal: string = '';
  tituloBoton: string = '';
  modoFormulario: string = '';
  pacienteSeleccionado: Paciente | null = null;

  constructor(private fb: FormBuilder, private pacienteService: PacienteService) {
    // Formulario principal (crear/editar)
    this.form = this.fb.group({
      id: [null],
      usuarioId: [null],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: [''],
      direccion: ['']
    });

    // Formulario de filtros
    this.filtrosForm = this.fb.group({
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombres: [''],
      apellidos: [''],
      genero: [''],
      telefono: [''],
      direccion: ['']
    });

    // Reacciona al cambio de filtros
    this.filtrosForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });

    this.listarPacientes();
  }

  // =======================
  // GETTERS
  // =======================
  get f() {
    return this.form.controls;
  }

  // =======================
  // CRUD
  // =======================
  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.pacientesFiltrados = [...data]; // copia para los filtros
      },
      error: (err) => console.error('Error al listar pacientes:', err)
    });
  }

  abrirNuevoPaciente() {
    this.modoFormulario = 'C';
    this.tituloModal = 'Nuevo Paciente';
    this.tituloBoton = 'Guardar';
    this.form.reset();
    const modalEl = document.getElementById('modalPaciente');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.modoFormulario = 'E';
    this.tituloModal = 'Editar Paciente';
    this.tituloBoton = 'Actualizar';
    this.pacienteSeleccionado = paciente;
    this.form.patchValue(paciente);
    const modalEl = document.getElementById('modalPaciente');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarPaciente() {
    if (this.form.invalid) return;

    const paciente = this.form.value as Paciente;

    if (this.modoFormulario === 'C') {
      this.pacienteService.guardarPaciente(paciente).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Paciente creado correctamente', 'success');
          this.listarPacientes();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo crear el paciente', 'error')
      });
    } else if (this.modoFormulario === 'E' && paciente.id) {
      this.pacienteService.actualizarPaciente(paciente).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Paciente actualizado correctamente', 'success');
          this.listarPacientes();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el paciente', 'error')
      });
    }
  }

  eliminarPaciente(paciente: Paciente) {
    Swal.fire({
      title: `¿Eliminar a ${paciente.nombres} ${paciente.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.eliminarPaciente(paciente.id!).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Paciente eliminado correctamente', 'success');
            this.listarPacientes();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el paciente', 'error')
        });
      }
    });
  }

  // =======================
  // FILTROS
  // =======================
  aplicarFiltros() {
    const valores = this.filtrosForm.value;
    this.pacientesFiltrados = this.pacientes.filter(p => {
      return Object.keys(valores).every(key => {
        const filtro = valores[key]?.toString().toLowerCase();
        const campo = p[key]?.toString().toLowerCase();
        return !filtro || campo.includes(filtro);
      });
    });
  }
}

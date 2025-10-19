import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import { CommonModule } from '@angular/common';
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
  form!: FormGroup;
  isLoading = false;
  modoEdicion = false;
  pacienteEditandoId: number | null = null;
  filtroTexto = '';

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarFormulario();
    this.listarPacientes();
  }

  // ====================================================
  // 🧩 FORMULARIO
  // ====================================================
  cargarFormulario() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.maxLength(20)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', Validators.required]
    });
  }

  // ====================================================
  // 📋 LISTAR PACIENTES
  // ====================================================
  listarPacientes() {
    this.isLoading = true;
    this.pacienteService.getPacientes().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) this.pacientes = data;
        else if (Array.isArray(data?.data)) this.pacientes = data.data;
        else if (Array.isArray(data?.content)) this.pacientes = data.content;
        else this.pacientes = [];

        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al listar pacientes:', err);
        this.isLoading = false;
      }
    });
  }

  // ====================================================
  // 🪟 MODALES
  // ====================================================
  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    this.pacienteEditandoId = null;
    this.form.reset();
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalPaciente'));
    modal.show();
  }

  editarPaciente(paciente: Paciente): void {
    this.modoEdicion = true;
    this.pacienteEditandoId = paciente.id ?? null;

    this.form.patchValue({
      usuarioId: paciente.usuarioId,
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion
    });

    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalPaciente'));
    modal.show();
  }

  cancelarEdicion(): void {
    const modalEl = document.getElementById('modalPaciente');
    if (modalEl) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
    this.form.reset();
    this.modoEdicion = false;
    this.pacienteEditandoId = null;
  }

  // ====================================================
  // 💾 GUARDAR / ACTUALIZAR PACIENTE
  // ====================================================
  guardarPaciente() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      usuarioId: Number(this.form.value.usuarioId),
      tipoDocumento: this.form.value.tipoDocumento.trim(),
      numeroDocumento: this.form.value.numeroDocumento.trim(),
      nombres: this.form.value.nombres.trim(),
      apellidos: this.form.value.apellidos.trim(),
      fechaNacimiento: this.form.value.fechaNacimiento,
      genero: this.form.value.genero.trim(),
      telefono: this.form.value.telefono.trim(),
      direccion: this.form.value.direccion.trim()
    };

    if (this.modoEdicion && this.pacienteEditandoId) {
      this.actualizarPaciente(this.pacienteEditandoId, payload);
    } else {
      this.crearPaciente(payload);
    }
  }

  private crearPaciente(payload: Paciente) {
    this.pacienteService.createPaciente(payload).subscribe({
      next: (data) => {
        console.log('Paciente creado:', data);
        Swal.fire('Éxito', 'Paciente creado correctamente', 'success');
        this.listarPacientes();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error al crear paciente:', err);
        Swal.fire('Error', err.error?.message || 'No se pudo crear el paciente', 'error');
      }
    });
  }

  private actualizarPaciente(id: number, payload: Paciente) {
    this.pacienteService.actualizarPaciente(id, payload).subscribe({
      next: (data) => {
        console.log('Paciente actualizado:', data);
        Swal.fire('Éxito', 'Paciente actualizado correctamente', 'success');
        this.listarPacientes();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error al actualizar paciente:', err);
        Swal.fire('Error', err.error?.message || 'No se pudo actualizar el paciente', 'error');
      }
    });
  }

  // ====================================================
  // 🗑️ ELIMINAR PACIENTE
  // ====================================================
  eliminarPaciente(paciente: Paciente) {
    if (!paciente.id) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al paciente "${paciente.nombres} ${paciente.apellidos}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.eliminarPaciente(paciente.id).subscribe({
          next: (resp) => {
            console.log('Paciente eliminado:', resp);
            Swal.fire('Eliminado', 'Paciente eliminado correctamente', 'success');
            this.listarPacientes();
          },
          error: (err) => {
            console.error('Error al eliminar paciente:', err);
            Swal.fire('Error', err.error?.message || 'No se pudo eliminar el paciente', 'error');
          }
        });
      }
    });
  }

  // ====================================================
  // 🔍 FILTRO DE BÚSQUEDA
  // ====================================================
  aplicarFiltro() {
    if (!this.filtroTexto.trim()) {
      this.pacientesFiltrados = [...this.pacientes];
      return;
    }

    const textoFiltro = this.filtroTexto.toLowerCase().trim();
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      return (
        paciente.nombres?.toLowerCase().includes(textoFiltro) ||
        paciente.apellidos?.toLowerCase().includes(textoFiltro) ||
        paciente.numeroDocumento?.toLowerCase().includes(textoFiltro) ||
        paciente.tipoDocumento?.toLowerCase().includes(textoFiltro) ||
        paciente.telefono?.toLowerCase().includes(textoFiltro) ||
        paciente.direccion?.toLowerCase().includes(textoFiltro) ||
        paciente.genero?.toLowerCase().includes(textoFiltro) ||
        paciente.fechaNacimiento?.toLowerCase().includes(textoFiltro)
      );
    });
  }

  limpiarFiltro() {
    this.filtroTexto = '';
    this.aplicarFiltro();
  }

}

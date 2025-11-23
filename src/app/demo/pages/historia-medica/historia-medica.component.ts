import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoriaMedicaService } from './service/historia-medica.service';
import { HistoriaMedica } from './models/historia-medica';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

/**
 * Componente para gestionar historias médicas.
 */
@Component({
  selector: 'app-historia-medica',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './historia-medica.component.html',
  styleUrl: './historia-medica.component.scss'
})
export class HistoriaMedicaComponent implements OnInit {
  historias: HistoriaMedica[] = [];
  historiasFiltradas: HistoriaMedica[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  form!: FormGroup;
  isLoading = false;
  modoEdicion = false;
  historiaEditandoId: number | null = null;
  filtroTexto = '';
  modalInstance: Modal | null = null;

  constructor(
    private readonly historiaService: HistoriaMedicaService,
    private readonly pacienteService: PacienteService,
    private readonly medicoService: MedicoService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarFormulario();
    this.cargarListas();
    this.listarHistorias();
  }

  /**
   * Inicializa el formulario de historia médica.
   */
  cargarFormulario() {
    this.form = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaConsulta: ['', Validators.required],
      motivoConsulta: ['', Validators.required],
      sintomas: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      observaciones: ['']
    });
  }

  /**
   * Carga las listas de pacientes y médicos.
   */
  cargarListas() {
    this.pacienteService.getPacientes().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) this.pacientes = data;
        else if (Array.isArray(data?.data)) this.pacientes = data.data;
        else if (Array.isArray(data?.content)) this.pacientes = data.content;
        else this.pacientes = [];
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
      }
    });

    this.medicoService.listarMedicos().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) this.medicos = data;
        else if (Array.isArray(data?.data)) this.medicos = data.data;
        else if (Array.isArray(data?.content)) this.medicos = data.content;
        else this.medicos = [];
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
        Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
      }
    });
  }

  /**
   * Lista todas las historias médicas.
   */
  listarHistorias() {
    this.isLoading = true;
    this.historiaService.listarHistorias().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) this.historias = data;
        else if (Array.isArray(data?.data)) this.historias = data.data;
        else if (Array.isArray(data?.content)) this.historias = data.content;
        else this.historias = [];

        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al listar historias médicas:', err);
        this.isLoading = false;
        this.historias = [];
        this.historiasFiltradas = [];
        
        let mensajeError = 'No se pudieron cargar las historias médicas.';
        if (err?.status === 404) {
          mensajeError = 'El endpoint de historias médicas no está disponible en el backend.';
        } else if (err?.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
        } else if (err?.error?.message) {
          mensajeError = err.error.message;
        }
        
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  /**
   * Aplica el filtro de búsqueda.
   */
  aplicarFiltro() {
    if (!this.filtroTexto.trim()) {
      this.historiasFiltradas = [...this.historias];
      return;
    }

    const texto = this.filtroTexto.toLowerCase();
    this.historiasFiltradas = this.historias.filter(historia => {
      const paciente = this.pacientes.find(p => p.id === historia.pacienteId);
      const medico = this.medicos.find(m => m.id === historia.medicoId);
      const nombrePaciente = paciente ? `${paciente.nombres} ${paciente.apellidos}`.toLowerCase() : '';
      const nombreMedico = medico ? `${medico.nombres} ${medico.apellidos}`.toLowerCase() : '';
      
      return (
        nombrePaciente.includes(texto) ||
        nombreMedico.includes(texto) ||
        historia.motivoConsulta?.toLowerCase().includes(texto) ||
        historia.diagnostico?.toLowerCase().includes(texto)
      );
    });
  }

  /**
   * Muestra el modal para crear una nueva historia médica.
   */
  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    this.historiaEditandoId = null;
    this.form.reset();
    const modalElement = document.getElementById('modalHistoria') as HTMLElement;
    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
  }

  /**
   * Muestra el modal para editar una historia médica existente.
   */
  editarHistoria(historia: HistoriaMedica): void {
    this.modoEdicion = true;
    this.historiaEditandoId = historia.id ?? null;

    this.form.patchValue({
      pacienteId: historia.pacienteId,
      medicoId: historia.medicoId,
      fechaConsulta: typeof historia.fechaConsulta === 'string' 
        ? historia.fechaConsulta.split('T')[0] 
        : (historia.fechaConsulta as Date).toISOString().split('T')[0],
      motivoConsulta: historia.motivoConsulta,
      sintomas: historia.sintomas,
      diagnostico: historia.diagnostico,
      tratamiento: historia.tratamiento,
      observaciones: historia.observaciones || ''
    });

    const modalElement = document.getElementById('modalHistoria') as HTMLElement;
    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
  }

  /**
   * Guarda o actualiza una historia médica.
   */
  guardarHistoria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const historia: HistoriaMedica = {
      ...this.form.value,
      fechaConsulta: this.form.value.fechaConsulta
    };

    this.isLoading = true;

    if (this.modoEdicion && this.historiaEditandoId) {
      this.historiaService.actualizarHistoria(this.historiaEditandoId, historia).subscribe({
        next: (resp) => {
          this.isLoading = false;
          this.modalInstance?.hide();
          Swal.fire('Éxito', resp.message || 'Historia médica actualizada correctamente', 'success');
          this.listarHistorias();
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', err.error?.message || 'Error al actualizar la historia médica', 'error');
        }
      });
    } else {
      this.historiaService.guardarHistoria(historia).subscribe({
        next: (resp) => {
          this.isLoading = false;
          this.modalInstance?.hide();
          Swal.fire('Éxito', resp.message || 'Historia médica guardada correctamente', 'success');
          this.listarHistorias();
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', err.error?.message || 'Error al guardar la historia médica', 'error');
        }
      });
    }
  }

  /**
   * Elimina una historia médica.
   */
  eliminarHistoria(historia: HistoriaMedica): void {
    if (!historia.id) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.historiaService.eliminarHistoria(historia.id!).subscribe({
          next: (resp) => {
            this.isLoading = false;
            Swal.fire('Éxito', resp.message || 'Historia médica eliminada correctamente', 'success');
            this.listarHistorias();
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire('Error', err.error?.message || 'Error al eliminar la historia médica', 'error');
          }
        });
      }
    });
  }

  /**
   * Obtiene el nombre completo de un paciente.
   */
  obtenerNombrePaciente(pacienteId: number): string {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
  }

  /**
   * Obtiene el nombre completo de un médico.
   */
  obtenerNombreMedico(medicoId: number): string {
    const medico = this.medicos.find(m => m.id === medicoId);
    return medico ? `${medico.nombres} ${medico.apellidos}` : 'N/A';
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { CitaRq } from './models/cita-rq';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';
import { RespuestaRs } from 'src/app/models/respuesta';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  citas: Cita[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  isLoading = false;
  searchTerm = '';
  modoFormulario = '';
  modalInstance: Modal | null = null;
  titleModal = '';
  titleBoton = '';
  citaSelected: Cita | null = null;

  form: FormGroup = new FormGroup({
    pacienteId: new FormControl(''),
    medicoId: new FormControl(''),
    fechaHora: new FormControl(''),
    estado: new FormControl(''),
    motivo: new FormControl('')
  });

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private formBuilder: FormBuilder
  ) {
    this.cargarFormulario();
    this.listarCitas();
    this.listarPacientes();
    this.listarMedicos();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      pacienteId: ['', [Validators.required]],
      medicoId: ['', [Validators.required]],
      fechaHora: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      motivo: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  listarCitas() {
    this.isLoading = true;
    this.citaService.listarCitas().subscribe({
      next: data => { this.citas = data; this.isLoading = false; },
      error: err => { console.error(err); this.isLoading = false; }
    });
  }

  listarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: data => this.pacientes = data as Paciente[],
      error: err => console.error(err)
    });
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: data => this.medicos = data as Medico[],
      error: err => console.error(err)
    });
  }

  filtrarCitas() {
    const termino = this.searchTerm.toLowerCase();
    return this.citas.filter(c =>
      c.paciente?.nombres.toLowerCase().includes(termino) ||
      c.medico?.nombres.toLowerCase().includes(termino) ||
      c.motivo.toLowerCase().includes(termino)
    );
  }

  openModal(modo: string) {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Registrar Cita' : 'Editar Cita';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';
    const modalElement = document.getElementById('modalCita');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.form.reset();
    }
  }

  abrirNuevaCita() {
    this.citaSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarCita(cita: Cita) {
    this.citaSelected = cita;
    this.form.patchValue({
      pacienteId: cita.paciente.id,
      medicoId: cita.medico.id,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      motivo: cita.motivo
    });
    this.openModal('E');
  }

  guardarCita() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const citaData: CitaRq = this.form.getRawValue();

    if (this.modoFormulario === 'C') {
      this.citaService.guardarCita(citaData).subscribe({
        next: (res: RespuestaRs) => {
          Swal.fire('Creación exitosa', res.message || 'Cita creada exitosamente', 'success');
          this.listarCitas();
          this.closeModal();
        },
        error: err => Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error')
      });
    } else if (this.modoFormulario === 'E' && this.citaSelected?.id) {
      this.citaService.actualizarCita(this.citaSelected.id, citaData).subscribe({
        next: (res: RespuestaRs) => {
          Swal.fire('Actualización exitosa', res.message || 'Cita actualizada exitosamente', 'success');
          this.listarCitas();
          this.closeModal();
        },
        error: err => Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error')
      });
    }
  }

  eliminarCita(cita: Cita) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la cita de "${cita.paciente.nombres}" con "${cita.medico.nombres}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.citaService.eliminarCita(cita.id).subscribe({
          next: (res: RespuestaRs) => {
            Swal.fire('Eliminado', res.message || 'Cita eliminada exitosamente', 'success');
            this.listarCitas();
          },
          error: err => Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error')
        });
      }
    });
  }
}

import { Component, Inject } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { Paciente } from './models/paciente';


@Component({
  selector: 'app-paciente',
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss',
  providers: [PacienteService]
})
export class PacienteComponent {

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  Pacientes: Paciente[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  PacienteSelected: Paciente;

  constructor(
    @Inject(PacienteService) private pacienteService: PacienteService,
  ) {
    this.listarPacientes();
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal() {
    this.titleModal = 'Listar Paciente';
    const modalElement = document.getElementById('modalListarPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  /**
   * Servicio de listar Pacientes.
   */
  listarPacientes() {
    console.log('Entro a cargar Pacientes');
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.Pacientes= data;
        console.log('Pacientes cargados:', this.Pacientes);
      },
      error: (err) => console.error('Error al listar Pacientes:', err)
    });
  }

}

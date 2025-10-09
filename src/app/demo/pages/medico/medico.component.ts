import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { CommonModule } from '@angular/common';
import { Medico } from './models/medico';

import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-medico',
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;

  medicoList: Medico[] = [];

  constructor(private readonly medicoService: MedicoService) {
    this.listaredicos();
  }

  listaredicos() {
    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        console.log(data);
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Médico' : 'Editar Médico';
    this.titleBoton = modo === 'C' ? 'Guardar Médico' : 'Actualizar Médico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = new Medico();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarMedico(medico: Medico) {
    this.medicoSelected = medico;
    this.openModal('E');
  }

  guardarMedico() {}
}

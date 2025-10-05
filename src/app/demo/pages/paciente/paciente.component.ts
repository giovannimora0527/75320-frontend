import { Component, OnInit } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  pacientes: Paciente[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente | null = null;

  constructor(private readonly pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.ListarPacientes();
  }

  ListarPacientes() {
    console.log('Iniciando carga de pacientes...');
    
    this.pacienteService.getPacientes().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (data: any) => {
        console.log('Respuesta del servicio:', data);
        
        if (Array.isArray(data)) {
          this.pacientes = data as Paciente[];
          console.log('Pacientes cargados (array directo):', this.pacientes.length);
        } else if (data && Array.isArray(data.data)) {
          this.pacientes = data.data as Paciente[];
          console.log('Pacientes cargados (data.data):', this.pacientes.length);
        } else if (data && Array.isArray(data.content)) {
          this.pacientes = data.content as Paciente[];
          console.log('Pacientes cargados (data.content):', this.pacientes.length);
        } else {
          this.pacientes = [];
          console.log('No se encontraron pacientes en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al listar Pacientes:', error);
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.pacientes = [];
      }
    });
  }
}

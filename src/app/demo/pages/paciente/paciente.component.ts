import { Component } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
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
import { CommonModule, NgForOf } from '@angular/common';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {

  paciente: Paciente[] = [];

  constructor(private pacienteService: PacienteService) {
    this.listarPacientes();
  }
  
  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.paciente = data;
        console.log('Pacientes cargados:', this.paciente);
      },
      error: (err) => console.error('Error al listar pacientes:', err)
    });
  }
}
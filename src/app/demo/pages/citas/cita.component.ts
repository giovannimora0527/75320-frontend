import { Component } from '@angular/core';
import { Cita } from './models/cita';
import { CitaService } from './service/cita.service';
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
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent {

  cita: Cita[] = [];

  constructor(private citaService: CitaService) {
    this.listarCitas();
  }
  
  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.cita = data;
        console.log('Citas cargadas:', this.cita);
      },
      error: (err) => console.error('Error al listar citas:', err)
    });
  }
}
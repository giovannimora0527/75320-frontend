import { Component } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
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
  selector: 'app-medicamento',
  imports: [CommonModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {

  medicamento: Medicamento[] = [];

  constructor(private medicamentoService: MedicamentoService) {
    this.listarMedicamentos();
  }
  
  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamento = data;
        console.log('Medicamentos cargados:', this.medicamento);
      },
      error: (err) => console.error('Error al listar medicamentos:', err)
    });
  }
}

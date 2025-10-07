import { Component } from '@angular/core';
import { Receta } from './models/receta';
import { RecetaService } from './service/receta.service';
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
  selector: 'app-receta',
  imports: [CommonModule],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class RecetaComponent {

  receta: Receta[] = [];

  constructor(private recetaService: RecetaService) {
    this.listarRecetas();
  }
  
  listarRecetas() {
    this.recetaService.listarRecetas().subscribe({
      next: (data) => {
        this.receta = data;
        console.log('Recetas cargadas:', this.receta);
      },
      error: (err) => console.error('Error al listar recetas:', err)
    });
  }
}
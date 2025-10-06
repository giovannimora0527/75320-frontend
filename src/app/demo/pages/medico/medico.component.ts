import { Component } from '@angular/core';
import { Medico } from './models/medico';
import { MedicoService } from './service/medico.service';
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

@Component({
  selector: 'app-medico',
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  medico: Medico[] = [];
  
  constructor(private readonly medicoService: MedicoService) {
    this.listarMedicos();
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data: any[]) => {
        
        this.medico = data.map((medico: any) => ({
          ...medico,
          especializacion: medico.especializacion 
        }));
        console.log(this.medico);
      },
      error: (err) => console.error('Error al listar médicos:', err)
    });
  }
  
}

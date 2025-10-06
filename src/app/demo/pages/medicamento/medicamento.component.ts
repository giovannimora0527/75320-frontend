import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from './service/medicamento.service';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  constructor(private readonly medicamentoService: MedicamentoService) {
    console.log('Módulo Medicamento cargado');
  }
}

    

  
  







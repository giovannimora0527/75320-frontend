import { Component } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';

@Component({
  selector: 'app-medicamento',
  imports: [],
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
      error: (err) => console.error('Error al listar usuarios:', err)
    });
  }
}

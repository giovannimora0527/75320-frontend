import { Component } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';

import { CommonModule} from '@angular/common';



@Component({
    selector: 'app-medicamento',
    imports: [CommonModule],
    templateUrl: './medicamento.component.html',
    styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {

    medicamento: Medicamento[] = [];

    constructor(private MedicamentoService: MedicamentoService) {
    this.listarMedicamentos();
    }
    
    listarMedicamentos() {
    this.MedicamentoService.listarMedicamentos().subscribe({
        next: (data) => {
        this.medicamento = data;
        console.log('Medicamentos cargados:', this.medicamento);
        },
        error: (err) => console.error('Error al listar medicamentos:', err)
    });
    }
}
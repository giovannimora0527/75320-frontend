import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historias-medicas',
  imports: [CommonModule, FormsModule],
  templateUrl: './historias-medicas.component.html',
  styleUrl: './historias-medicas.component.scss'
})
export class HistoriasMedicasComponent {
  historias: { paciente: string; diagnostico: string; fecha: string; notas: string }[] = [
    { paciente: 'Juan Pérez', diagnostico: 'Gripe', fecha: '2025-10-05', notas: 'Reposo y líquidos' }
  ];

  form: { paciente: string; diagnostico: string; fecha: string; notas: string } = {
    paciente: '',
    diagnostico: '',
    fecha: '',
    notas: ''
  };

  editingIndex: number | null = null;

  save() {
    const payload = { ...this.form };
    if (this.editingIndex === null) {
      this.historias = [...this.historias, payload];
    } else {
      const clone = [...this.historias];
      clone[this.editingIndex] = payload;
      this.historias = clone;
    }
    this.reset();
  }

  edit(index: number) {
    const item = this.historias[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    this.historias = this.historias.filter((_, i) => i !== index);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { paciente: '', diagnostico: '', fecha: '', notas: '' };
    this.editingIndex = null;
  }
}



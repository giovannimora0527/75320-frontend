import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulas-medicas',
  imports: [CommonModule, FormsModule],
  templateUrl: './formulas-medicas.component.html',
  styleUrl: './formulas-medicas.component.scss'
})
export class FormulasMedicasComponent {
  formulas: { paciente: string; medico: string; fecha: string; indicaciones: string }[] = [
    { paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2025-10-05', indicaciones: 'Tomar 1 cada 8 horas' }
  ];

  form: { paciente: string; medico: string; fecha: string; indicaciones: string } = {
    paciente: '',
    medico: '',
    fecha: '',
    indicaciones: ''
  };

  editingIndex: number | null = null;

  save() {
    const payload = { ...this.form };
    if (this.editingIndex === null) {
      this.formulas = [...this.formulas, payload];
    } else {
      const clone = [...this.formulas];
      clone[this.editingIndex] = payload;
      this.formulas = clone;
    }
    this.reset();
  }

  edit(index: number) {
    const item = this.formulas[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    this.formulas = this.formulas.filter((_, i) => i !== index);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { paciente: '', medico: '', fecha: '', indicaciones: '' };
    this.editingIndex = null;
  }
}



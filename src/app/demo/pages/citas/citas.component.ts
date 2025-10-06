import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas',
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  citas: { paciente: string; medico: string; fecha: string; hora: string }[] = [
    { paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2025-10-05', hora: '10:00' }
  ];

  form: { paciente: string; medico: string; fecha: string; hora: string } = {
    paciente: '',
    medico: '',
    fecha: '',
    hora: ''
  };

  editingIndex: number | null = null;

  save() {
    const payload = { ...this.form };
    if (this.editingIndex === null) {
      this.citas = [...this.citas, payload];
    } else {
      const clone = [...this.citas];
      clone[this.editingIndex] = payload;
      this.citas = clone;
    }
    this.reset();
  }

  edit(index: number) {
    const item = this.citas[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  reprogram(index: number) {
    this.edit(index);
  }

  remove(index: number) {
    this.citas = this.citas.filter((_, i) => i !== index);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { paciente: '', medico: '', fecha: '', hora: '' };
    this.editingIndex = null;
  }
}



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicamentos',
  imports: [CommonModule, FormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss'
})
export class MedicamentosComponent {
  medicamentos: { nombre: string; codigo: string; presentacion: string }[] = [
    { nombre: 'Paracetamol', codigo: 'MED-001', presentacion: 'Tabletas' }
  ];

  form: { nombre: string; codigo: string; presentacion: string } = {
    nombre: '',
    codigo: '',
    presentacion: ''
  };

  editingIndex: number | null = null;

  save() {
    const payload = { ...this.form };
    if (this.editingIndex === null) {
      this.medicamentos = [...this.medicamentos, payload];
    } else {
      const clone = [...this.medicamentos];
      clone[this.editingIndex] = payload;
      this.medicamentos = clone;
    }
    this.reset();
  }

  edit(index: number) {
    const item = this.medicamentos[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    this.medicamentos = this.medicamentos.filter((_, i) => i !== index);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { nombre: '', codigo: '', presentacion: '' };
    this.editingIndex = null;
  }
}



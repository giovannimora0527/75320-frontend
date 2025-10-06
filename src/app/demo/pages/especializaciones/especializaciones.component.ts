import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-especializaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrl: './especializaciones.component.scss'
})
export class EspecializacionesComponent {
  especializaciones: { nombre: string; codigo: string }[] = [
    { nombre: 'Cardiología', codigo: 'ESP-001' }
  ];

  form: { nombre: string; codigo: string } = {
    nombre: '',
    codigo: ''
  };

  editingIndex: number | null = null;

  save() {
    const payload = { ...this.form };
    if (this.editingIndex === null) {
      this.especializaciones = [...this.especializaciones, payload];
    } else {
      const clone = [...this.especializaciones];
      clone[this.editingIndex] = payload;
      this.especializaciones = clone;
    }
    this.reset();
  }

  edit(index: number) {
    const item = this.especializaciones[index];
    this.form = { ...item };
    this.editingIndex = index;
  }

  remove(index: number) {
    this.especializaciones = this.especializaciones.filter((_, i) => i !== index);
    if (this.editingIndex === index) {
      this.reset();
    }
  }

  reset() {
    this.form = { nombre: '', codigo: '' };
    this.editingIndex = null;
  }
}



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentosService } from './service/medicamentos.service';
import { Medicamento } from './models/medicamento';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss'
})
export class MedicamentosComponent {
  form: FormGroup;
  seleccion: Medicamento | null = null;
  lista: Medicamento[] = [];

  constructor(private fb: FormBuilder, private svc: MedicamentosService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      presentacion: ['', Validators.required],
      concentracion: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
    this.svc.list().subscribe(items => this.lista = items);
  }

  editar(item: Medicamento) {
    this.seleccion = item;
    this.form.patchValue(item);
  }

  cancelar() {
    this.seleccion = null;
    this.form.reset({ activo: true, stock: 0 });
  }

  guardar() {
    if (this.form.invalid) return;
    const valores = this.form.value as Omit<Medicamento, 'id'>;
    if (this.seleccion) {
      this.svc.update(this.seleccion.id, valores);
    } else {
      this.svc.create(valores);
    }
    this.cancelar();
  }

  eliminar(id: number) {
    this.svc.remove(id);
    if (this.seleccion?.id === id) this.cancelar();
  }
}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from './service/medicamento.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-medicamentos',
  standalone: true,  // ✅ IMPORTANTE
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // ✅ Importa aquí los módulos
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit {
  medicamentos: any[] = [];
  form!: FormGroup;
  editando = false;
  medicamentoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerMedicamentos();
  }

  crearFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  obtenerMedicamentos() {
    this.medicamentoService.listar().subscribe({
      next: (data) => (this.medicamentos = data),
      error: (err) => console.error('Error al obtener medicamentos:', err)
    });
  }

  guardarMedicamento() {
    if (this.form.invalid) return;

    if (this.editando && this.medicamentoSeleccionado) {
      this.medicamentoService
        .actualizar(this.medicamentoSeleccionado.id, this.form.value)
        .subscribe({
          next: () => {
            alert('✅ Medicamento actualizado correctamente');
            this.obtenerMedicamentos();
            this.cancelarEdicion();
          },
          error: (err) => console.error('Error al actualizar medicamento:', err)
        });
    } else {
      this.medicamentoService.crear(this.form.value).subscribe({
        next: () => {
          alert('💊 Medicamento creado correctamente');
          this.obtenerMedicamentos();
          this.form.reset();
        },
        error: (err) => console.error('Error al crear medicamento:', err)
      });
    }
  }

  editarMedicamento(medicamento: any) {
    this.editando = true;
    this.medicamentoSeleccionado = medicamento;
    this.form.patchValue(medicamento);
  }

  eliminarMedicamento(id: number) {
    if (confirm('¿Deseas eliminar este medicamento?')) {
      this.medicamentoService.eliminar(id).subscribe({
        next: () => {
          alert('🗑️ Medicamento eliminado');
          this.obtenerMedicamentos();
        },
        error: (err) => console.error('Error al eliminar medicamento:', err)
      });
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.medicamentoSeleccionado = null;
    this.form.reset();
  }
}






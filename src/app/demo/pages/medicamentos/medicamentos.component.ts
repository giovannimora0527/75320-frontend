import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from './service/medicamento.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true, // si quieres usar standalone
  selector: 'app-medicamento',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class MedicamentoComponent implements OnInit {

  medicamentos: any[] = [];
  form!: FormGroup;
  titleModal: string = '';
  titleBoton: string = '';

  constructor(private fb: FormBuilder, private medicamentoService: MedicamentoService) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerMedicamentos();
  }

  crearFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      stock: [0, Validators.required],
      precio: [0, Validators.required]
    });
  }

  obtenerMedicamentos(): void {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (res: any) => {
        this.medicamentos = res || [];
      },
      error: (err) => {
        console.error('Error al obtener medicamentos:', err);
      }
    });
  }

  abrirNuevoMedicamento(): void {
    this.form.reset();
    this.titleModal = 'Nuevo Medicamento';
    this.titleBoton = 'Guardar';
    (document.getElementById('modalCrearMedicamento') as any)?.classList.add('show');
    (document.getElementById('modalCrearMedicamento') as any).style.display = 'block';
  }

  abrirEditarMedicamento(medicamento: any): void {
    this.form.patchValue(medicamento);
    this.titleModal = 'Editar Medicamento';
    this.titleBoton = 'Actualizar';
    (document.getElementById('modalCrearMedicamento') as any)?.classList.add('show');
    (document.getElementById('modalCrearMedicamento') as any).style.display = 'block';
  }

  closeModal(): void {
    (document.getElementById('modalCrearMedicamento') as any)?.classList.remove('show');
    (document.getElementById('modalCrearMedicamento') as any).style.display = 'none';
  }

  guardarMedicamento(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const medicamento = this.form.value;

    if (medicamento.id) {
      this.medicamentoService.actualizarMedicamento(medicamento).subscribe({
        next: () => {
          alert('Medicamento actualizado correctamente');
          this.closeModal();
          this.obtenerMedicamentos();
        },
        error: (err) => {
          console.error('Error al actualizar el medicamento:', err);
        }
      });
    } else {
      this.medicamentoService.crearMedicamento(medicamento).subscribe({
        next: () => {
          alert('Medicamento creado correctamente');
          this.closeModal();
          this.obtenerMedicamentos();
        },
        error: (err) => {
          console.error('Error al crear el medicamento:', err);
        }
      });
    }
  }
}


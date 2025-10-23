import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { MedicamentosService } from './service/medicamentos.service';
import { Medicamento } from './models/medicamento';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  form!: FormGroup;
  modalInstance: Modal | null = null;
  tituloModal = '';
  tituloBoton = '';
  modoFormulario = '';
  cargando = false;
  filtro = '';

  constructor(
    private fb: FormBuilder,
    private medicamentosService: MedicamentosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presentacion: ['', Validators.required],
      fechaCmpra: ['', Validators.required],
      fechaVence: ['', Validators.required]
    });

    this.listarMedicamentos();
  }

  listarMedicamentos(): void {
    this.cargando = true;
    this.medicamentosService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;
        this.medicamentosFiltrados = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
      }
    });
  }

  aplicarFiltro(): void {
    const term = this.filtro.toLowerCase();
    this.medicamentosFiltrados = this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(term) ||
      m.presentacion.toLowerCase().includes(term) ||
      m.descripcion.toLowerCase().includes(term)
    );
  }

  abrirNuevo(): void {
    this.modoFormulario = 'C';
    this.tituloModal = 'Nuevo Medicamento';
    this.tituloBoton = 'Guardar';
    this.form.reset();
    const modalEl = document.getElementById('modalMedicamento');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  abrirEditar(med: Medicamento): void {
    this.modoFormulario = 'E';
    this.tituloModal = 'Editar Medicamento';
    this.tituloBoton = 'Actualizar';
    this.form.patchValue({
      id: med.id,
      nombre: med.nombre,
      descripcion: med.descripcion,
      presentacion: med.presentacion,
      fechaCmpra: med.fechaCmpra,
      fechaVence: med.fechaVence
    });
    const modalEl = document.getElementById('modalMedicamento');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardar(): void {
    if (this.form.invalid) {
      Swal.fire('Atención', 'Por favor completa los campos obligatorios', 'warning');
      return;
    }

    const medicamento: Medicamento = {
      id: this.form.value.id,
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      presentacion: this.form.value.presentacion,
      fechaCmpra: this.form.value.fechaCmpra,
      fechaVence: this.form.value.fechaVence
    };

    this.cargando = true;

    if (this.modoFormulario === 'C') {
      this.medicamentosService.guardarMedicamento(medicamento).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Medicamento guardado correctamente', 'success');
          this.listarMedicamentos();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo guardar el medicamento', 'error');
        },
        complete: () => (this.cargando = false)
      });
    } else if (this.modoFormulario === 'E') {
      this.medicamentosService.actualizarMedicamento(medicamento).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Medicamento actualizado correctamente', 'success');
          this.listarMedicamentos();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el medicamento', 'error');
        },
        complete: () => (this.cargando = false)
      });
    }
  }
}

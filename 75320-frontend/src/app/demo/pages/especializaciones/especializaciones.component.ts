import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { EspecializacionService } from './service/especializacion.service';

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss']
})
export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  especializaciones: any[] = [];
  form: FormGroup;

  constructor(private especializacionService: EspecializacionService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    this.especializacionService.getEspecializaciones().subscribe({
      next: (data) => (this.especializaciones = data),
      error: (err) => console.error(err)
    });
  }

  abrirNuevaEspecializacion() {
    this.form.reset();
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  guardarEspecializacion() {
    if (this.form.valid) {
      this.especializacionService.guardarEspecializacion(this.form.value).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Especialización guardada correctamente', 'success');
          this.listarEspecializaciones();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo guardar', 'error')
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicoService } from './service/medico.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class MedicoComponent implements OnInit {

  medicos: any[] = [];
  form!: FormGroup;
  titleModal: string = '';
  titleBoton: string = '';

  constructor(private fb: FormBuilder, private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.listarMedicos();
  }

  crearFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      especialidad: ['', Validators.required]
    });
  }

  listarMedicos(): void {
    this.medicoService.getMedicos().subscribe({
      next: (res: any) => {
        this.medicos = res || [];
      },
      error: (err) => {
        console.error('Error al obtener médicos:', err);
      }
    });
  }

  abrirNuevoMedico(): void {
    this.form.reset();
    this.titleModal = 'Nuevo Médico';
    this.titleBoton = 'Guardar';
    (document.getElementById('modalCrearMedico') as any)?.classList.add('show');
    (document.getElementById('modalCrearMedico') as any).style.display = 'block';
  }

  abrirEditarMedico(medico: any): void {
    this.form.patchValue(medico);
    this.titleModal = 'Editar Médico';
    this.titleBoton = 'Actualizar';
    (document.getElementById('modalCrearMedico') as any)?.classList.add('show');
    (document.getElementById('modalCrearMedico') as any).style.display = 'block';
  }

  closeModal(): void {
    (document.getElementById('modalCrearMedico') as any)?.classList.remove('show');
    (document.getElementById('modalCrearMedico') as any).style.display = 'none';
  }

  guardarMedico(): void {
    if (this.form.invalid) { // <-- CORRECCIÓN: 'invalid' en lugar de 'invali'
      this.form.markAllAsTouched();
      return;
    }

    const medico = this.form.value;

    if (medico.id) {
      // Actualizar médico existente
      this.medicoService.actualizarMedico(medico).subscribe({
        next: () => {
          alert('Médico actualizado correctamente');
          this.closeModal();
          this.listarMedicos();
        },
        error: (err) => {
          console.error('Error al actualizar médico:', err);
        }
      });
    } else {
      // Crear nuevo médico
      this.medicoService.crearMedico(medico).subscribe({
        next: () => {
          alert('Médico creado correctamente');
          this.closeModal();
          this.listarMedicos();
        },
        error: (err) => {
          console.error('Error al crear médico:', err);
        }
      });
    }
  }

  eliminarMedico(id: number): void {
    if (confirm('¿Está seguro de eliminar este médico?')) {
      this.medicoService.eliminarMedico(id).subscribe({
        next: () => {
          alert('Médico eliminado correctamente');
          this.listarMedicos();
        },
        error: (err) => {
          console.error('Error al eliminar médico:', err);
        }
      });
    }
  }
}

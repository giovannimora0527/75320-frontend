import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicoService } from './service/medico.service';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent implements OnInit {
  medicoForm: FormGroup;
  medicos: any[] = []; // 👉 lista de médicos
  mostrarFormulario = false; // 👉 alterna entre lista y formulario

  constructor(private fb: FormBuilder, private medicoService: MedicoService) {
    this.medicoForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: [''],
      registroProfesional: [''],
      especializacionId: ['', Validators.required] // ⚠️ id de la especialización
    });
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.medicoService.listarMedicos().subscribe({
      next: (res) => {
        this.medicos = res;
      },
      error: (err) => {
        console.error('❌ Error al cargar médicos:', err);
      }
    });
  }

  guardarMedico(): void {
    if (this.medicoForm.valid) {
      const medicoData = {
        ...this.medicoForm.value,
        especializacion: { id: this.medicoForm.value.especializacionId }
      };
      delete medicoData.especializacionId;

      this.medicoService.guardarMedico(medicoData).subscribe({
        next: () => {
          alert('✅ Médico guardado correctamente');
          this.medicoForm.reset();
          this.mostrarFormulario = false;
          this.cargarMedicos(); // ✅ recarga la lista
        },
        error: (err) => {
          console.error('❌ Error:', err);
          alert('Ocurrió un error al guardar el médico');
        }
      });
    } else {
      alert('Por favor complete todos los campos obligatorios');
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.medicoForm.reset();
  }
}









import { Component, OnInit } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent implements OnInit {

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  especializaciones: Especializacion[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion | null = null;
  form!: FormGroup;
  mensaje: string = '';
  tipoMensaje: 'success' | 'danger' | '' = '';
  mensajeTimeoutRef: any;

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ListarEspecializacion();
  }

  ListarEspecializacion() {
    console.log('Iniciando carga de especializaciones...');
    
    this.especializacionService.getEspecializaciones().subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (data: any) => {
        console.log('Respuesta del servicio:', data);
        
        if (Array.isArray(data)) {
          this.especializaciones = data as Especializacion[];
          console.log('Especializaciones cargadas (array directo):', this.especializaciones.length);
        } else if (data && Array.isArray(data.data)) {
          this.especializaciones = data.data as Especializacion[];
          console.log('Especializaciones cargadas (data.data):', this.especializaciones.length);
        } else if (data && Array.isArray(data.content)) {
          this.especializaciones = data.content as Especializacion[];
          console.log('Especializaciones cargadas (data.content):', this.especializaciones.length);
        } else {
          this.especializaciones = [];
          console.log('No se encontraron especializaciones en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al listar Especializaciones:', error);
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.especializaciones = [];
      }
    });
  }

}

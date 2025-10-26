import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CitaService } from './service/cita.service';
import { Cita } from './model/cita';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent {
  titleSpinner: string = '';
  citasList: Cita[] = [];

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly citaService: CitaService
  ) {
    this.listarCitas();
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe(
      {
        next: (data) => {          
          this.citasList = data;        
        },
        error: (error) => {
          console.error('Error al listar las citas:', error); 
        }
      }
    );
  }
}

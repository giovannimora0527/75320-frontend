import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspecializacionesService } from './service/especializaciones.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-especializaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especializaciones.component.html',
  styleUrl: './especializaciones.component.scss'
})
export class EspecializacionesComponent {
  especializaciones: Especializacion[] = [];
  constructor(private svc: EspecializacionesService) {
    this.svc.list().subscribe(d => this.especializaciones = d);
  }
}



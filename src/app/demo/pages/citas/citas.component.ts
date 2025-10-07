import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from './service/citas.service';
import { Cita } from './models/cita';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  citas: Cita[] = [];
  constructor(private svc: CitasService) {
    this.svc.list().subscribe(d => this.citas = d);
  }
}



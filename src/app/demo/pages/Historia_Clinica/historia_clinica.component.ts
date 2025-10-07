import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriasService } from './service/historia_clinica.service';
import { HistoriaClinica } from './models/historia_clinica';

@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia_clinica.component.html',
  styleUrl: './historia_clinica.component.scss'
})
export class HistoriasComponent {
  historias: HistoriaClinica[] = [];
  constructor(private svc: HistoriasService) {
    this.svc.list().subscribe(d => this.historias = d);
  }
}
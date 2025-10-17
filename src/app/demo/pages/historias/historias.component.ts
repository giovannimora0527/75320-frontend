import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriasService } from './service/historias.service';
import { HistoriaClinica } from './models/historia';

@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historias.component.html',
  styleUrl: './historias.component.scss'
})
export class HistoriasComponent {
  historias: HistoriaClinica[] = [];
  constructor(private svc: HistoriasService) {
    this.svc.list().subscribe(d => this.historias = d);
  }
}



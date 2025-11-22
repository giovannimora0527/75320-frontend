import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from './service/auditoria.service';
import { AuditoriaLog } from './model/auditoria-log.model';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent {

  filtros = {
    usuario: '',
    tipo: 'Todos',
    fechaDesde: '',
    fechaHasta: ''
  };

  logs: AuditoriaLog[] = [];
  paginaActual = 0;
  tamanioPagina = 10;
  totalPaginas = 0;

  tiposEventos = ['Todos','LOGIN', 'LOGOUT', 'CREACION', 'ACTUALIZACION', 'ELIMINACION'];

  constructor(private auditoriaService: AuditoriaService) {}

  buscar() {
  console.log("➡️ Ejecutando buscar() con filtros:", this.filtros);

  this.auditoriaService.buscar(
    this.filtros.usuario,
    this.filtros.tipo,
    this.filtros.fechaDesde,
    this.filtros.fechaHasta,
    this.paginaActual,
    this.tamanioPagina
  ).subscribe(res => {
    console.log("➡️ Respuesta backend:", res);
    this.logs = res.content;
    this.totalPaginas = res.totalPages;
  });
}




  anterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.buscar();
    }
  }

  siguiente() {
    if (this.paginaActual + 1 < this.totalPaginas) {
      this.paginaActual++;
      this.buscar();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuditLogService } from './service/audit-log.service';
import { AuditLog } from './model/audit-log';

@Component({
  selector: 'app-auditoria-logs',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auditoria-logs.component.html',
  styleUrl: './auditoria-logs.component.scss'
})
export class AuditoriaLogsComponent implements OnInit {

  filtrosForm: FormGroup;

  logs: AuditLog[] = [];
  paginaActual = 0;
  tamanoPagina = 10;
  totalPaginas = 0;
  totalElementos = 0;
  cargando = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auditLogService: AuditLogService
  ) {
    this.filtrosForm = this.formBuilder.group({
      username: [''],
      tipoEvento: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.buscarLogs();
  }

  buscarLogs(pagina: number = 0): void {
    this.cargando = true;

    const valores = this.filtrosForm.value;

    this.auditLogService
      .listarLogs(
        valores.username,
        valores.tipoEvento,
        valores.fechaDesde,
        valores.fechaHasta,
        pagina,
        this.tamanoPagina
      )
      .subscribe({
        next: (page) => {
          this.logs = page.content;
          this.paginaActual = page.number;
          this.tamanoPagina = page.size;
          this.totalPaginas = page.totalPages;
          this.totalElementos = page.totalElements;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error consultando logs de auditoría', err);
          this.logs = [];
          this.cargando = false;
        }
      });
  }

  aplicarFiltros(): void {
    this.buscarLogs(0);
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
    this.buscarLogs(0);
  }

  irPaginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.buscarLogs(this.paginaActual - 1);
    }
  }

  irPaginaSiguiente(): void {
    if (this.paginaActual + 1 < this.totalPaginas) {
      this.buscarLogs(this.paginaActual + 1);
    }
  }
}

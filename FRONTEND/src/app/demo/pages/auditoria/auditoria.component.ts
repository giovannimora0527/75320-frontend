import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuditoriaService } from './service/auditoria.service';
import { Auditoria, AuditoriaFiltros } from './models/auditoria';
import Swal from 'sweetalert2';

/**
 * Componente para visualizar los logs de auditoría del sistema.
 * Permite filtrar por fecha, usuario, tipo de evento y estado (exitoso/fallido).
 * Muestra los resultados en una tabla con paginación.
 */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxSpinnerModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit {
  filtrosForm: FormGroup;
  auditorias: Auditoria[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  titleSpinner: string = 'Cargando auditoría...';

  // Opciones para el select de tipo
  tiposEvento = [
    { value: 'TODOS', label: 'Todos los eventos' },
    { value: 'LOGIN', label: 'Inicio de sesión' },
    { value: 'RECUPERACION', label: 'Recuperación de contraseña' }
  ];

  // Opciones para el select de estado
  estadosEvento = [
    { value: null, label: 'Todos' },
    { value: true, label: 'Exitoso' },
    { value: false, label: 'Fallido' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private auditoriaService: AuditoriaService,
    private spinner: NgxSpinnerService
  ) {
    this.filtrosForm = this.formBuilder.group({
      username: [''],
      tipo: ['TODOS'],
      exitoso: [null],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  /**
   * Carga los registros de auditoría según los filtros actuales.
   */
  cargarAuditoria(): void {
    this.spinner.show();
    this.titleSpinner = 'Cargando auditoría...';

    const filtros: AuditoriaFiltros = {
      username: this.filtrosForm.get('username')?.value?.trim() || undefined,
      tipo: this.filtrosForm.get('tipo')?.value || 'TODOS',
      exitoso: this.filtrosForm.get('exitoso')?.value,
      fechaDesde: this.filtrosForm.get('fechaDesde')?.value || undefined,
      fechaHasta: this.filtrosForm.get('fechaHasta')?.value || undefined,
      page: this.currentPage,
      size: this.pageSize
    };

    let request: any;

    if (filtros.tipo === 'LOGIN') {
      request = this.auditoriaService.listarAuditoriaLogin(filtros);
    } else if (filtros.tipo === 'RECUPERACION') {
      request = this.auditoriaService.listarAuditoriaRecuperacion(filtros);
    } else {
      // Si es TODOS, cargar ambos y combinar
      const loginRequest = this.auditoriaService.listarAuditoriaLogin(filtros);
      const recuperacionRequest = this.auditoriaService.listarAuditoriaRecuperacion(filtros);
      
      // Combinar ambos resultados
      loginRequest.subscribe({
        next: (loginPage) => {
          recuperacionRequest.subscribe({
            next: (recuperacionPage) => {
              const combinedContent = [...loginPage.content, ...recuperacionPage.content];
              // Ordenar por fecha descendente
              combinedContent.sort((a, b) => 
                new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
              );
              
              // Aplicar paginación manual
              const start = this.currentPage * this.pageSize;
              const end = start + this.pageSize;
              this.auditorias = combinedContent.slice(start, end);
              this.totalElements = combinedContent.length;
              this.totalPages = Math.ceil(this.totalElements / this.pageSize);
              
              this.spinner.hide();
            },
            error: (error) => this.manejarError(error)
          });
        },
        error: (error) => this.manejarError(error)
      });
      return;
    }

    request.subscribe({
      next: (page) => {
        this.auditorias = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.spinner.hide();
      },
      error: (error) => this.manejarError(error)
    });
  }

  /**
   * Aplica los filtros y recarga los datos.
   */
  aplicarFiltros(): void {
    this.currentPage = 0;
    this.cargarAuditoria();
  }

  /**
   * Limpia todos los filtros.
   */
  limpiarFiltros(): void {
    this.filtrosForm.reset({
      username: '',
      tipo: 'TODOS',
      exitoso: null,
      fechaDesde: '',
      fechaHasta: ''
    });
    this.currentPage = 0;
    this.cargarAuditoria();
  }

  /**
   * Cambia la página actual.
   */
  cambiarPagina(page: number): void {
    this.currentPage = page;
    this.cargarAuditoria();
  }

  /**
   * Cambia el tamaño de página.
   */
  cambiarTamanoPagina(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = 0;
    this.cargarAuditoria();
  }

  /**
   * Formatea la fecha para mostrar.
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Obtiene la clase CSS para el badge de estado.
   */
  getEstadoClass(exitoso: boolean): string {
    return exitoso ? 'badge bg-success' : 'badge bg-danger';
  }

  /**
   * Obtiene el texto del estado.
   */
  getEstadoTexto(exitoso: boolean): string {
    return exitoso ? 'Exitoso' : 'Fallido';
  }

  /**
   * Obtiene la clase CSS para el badge de tipo.
   */
  getTipoClass(tipo: string): string {
    return tipo === 'LOGIN' ? 'badge bg-primary' : 'badge bg-info';
  }

  /**
   * Maneja los errores de las peticiones.
   */
  private manejarError(error: any): void {
    this.spinner.hide();
    console.error('Error al cargar auditoría:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.error?.mensaje || 'Error al cargar los registros de auditoría',
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Obtiene el número máximo de registro a mostrar.
   */
  getMaxRegistro(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  /**
   * Obtiene el array de números de página para la paginación.
   */
  getPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5;
    let inicio = Math.max(0, this.currentPage - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPages - 1, inicio + maxPaginas - 1);
    
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(0, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
}


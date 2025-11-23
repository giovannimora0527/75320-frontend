import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuditoriaService } from './service/auditoria.service';
import { LogAuditoria, LogsAuditoriaResponse, FiltrosLogsAuditoria } from './models/log-auditoria';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

/**
 * Componente para visualizar y filtrar los logs de auditoría del sistema.
 * 
 * @remarks
 * Este componente permite:
 * - Visualizar logs de auditoría en una tabla paginada
 * - Filtrar por fecha, usuario y tipo de evento
 * - Actualización en tiempo real de los resultados
 * 
 * @example
 * ```html
 * <app-auditoria></app-auditoria>
 * ```
 */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit, OnDestroy {
  /** Formulario de filtros */
  filtrosForm: FormGroup;
  
  /** Lista de logs de auditoría */
  logs: LogAuditoria[] = [];
  
  /** Tipos de eventos disponibles */
  tiposEventos: string[] = [];
  
  /** Página actual */
  paginaActual: number = 1;
  
  /** Tamaño de página */
  tamanoPagina: number = 20;
  
  /** Total de registros */
  totalRegistros: number = 0;
  
  /** Total de páginas */
  totalPaginas: number = 0;
  
  /** Indica si está cargando datos */
  isLoading: boolean = false;
  
  /** Subject para manejar la destrucción del componente */
  private destroy$ = new Subject<void>();
  
  /** Subject para el debounce de búsqueda */
  private searchSubject = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private auditoriaService: AuditoriaService,
    private spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el componente.
   * Carga los tipos de eventos y los logs iniciales.
   */
  ngOnInit(): void {
    this.cargarTiposEventos();
    this.cargarLogs();
    
    // Configurar debounce para búsqueda en tiempo real
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.aplicarFiltros();
    });
    
    // Suscribirse a cambios en el formulario
    this.filtrosForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.paginaActual = 1; // Resetear a primera página al cambiar filtros
        this.searchSubject.next();
      });
  }

  /**
   * Limpia los recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario de filtros.
   */
  private inicializarFormulario(): void {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.filtrosForm = this.formBuilder.group({
      fechaInicio: [hace30Dias.toISOString().split('T')[0]],
      fechaFin: [hoy.toISOString().split('T')[0]],
      usuario: [''],
      tipoEvento: ['']
    });
  }

  /**
   * Carga los tipos de eventos disponibles desde el backend.
   */
  private cargarTiposEventos(): void {
    // Valores por defecto en caso de que el endpoint no esté disponible
    this.tiposEventos = [
      'LOGIN_FALLIDO',
      'LOGIN_EXITOSO',
      'RECUPERACION_PASSWORD',
      'USUARIO_BLOQUEADO',
      'CAMBIO_PASSWORD',
      'ACCESO_DENEGADO'
    ];

    // Intentar cargar desde el backend, pero no fallar si no está disponible
    this.auditoriaService.obtenerTiposEventos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tipos) => {
          if (Array.isArray(tipos) && tipos.length > 0) {
            this.tiposEventos = tipos;
          }
        },
        error: (error) => {
          // Silenciosamente usar los valores por defecto
          console.warn('No se pudieron cargar los tipos de eventos del backend, usando valores por defecto:', error);
          // Los valores por defecto ya están asignados arriba
        }
      });
  }

  /**
   * Carga los logs de auditoría aplicando los filtros actuales.
   */
  cargarLogs(): void {
    this.isLoading = true;
    this.spinner.show();

    // Obtener valores del formulario
    const fechaInicio = this.filtrosForm.get('fechaInicio')?.value;
    const fechaFin = this.filtrosForm.get('fechaFin')?.value;
    const usuario = this.filtrosForm.get('usuario')?.value?.trim() || undefined;
    const tipoEvento = this.filtrosForm.get('tipoEvento')?.value || undefined;

    const filtros: FiltrosLogsAuditoria = {
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      usuario: usuario,
      tipoEvento: tipoEvento,
      pagina: this.paginaActual,
      tamanoPagina: this.tamanoPagina
    };

    this.auditoriaService.obtenerLogs(filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Manejar diferentes formatos de respuesta
          if (response && typeof response === 'object') {
            this.logs = Array.isArray(response.data) ? response.data : 
                       Array.isArray(response.content) ? response.content :
                       Array.isArray(response) ? response : [];
            this.totalRegistros = response.total || response.totalElements || this.logs.length;
            this.totalPaginas = response.totalPaginas || response.totalPages || 
                               Math.ceil(this.totalRegistros / this.tamanoPagina);
          } else if (Array.isArray(response)) {
            this.logs = response;
            this.totalRegistros = response.length;
            this.totalPaginas = Math.ceil(this.totalRegistros / this.tamanoPagina);
          } else {
            this.logs = [];
            this.totalRegistros = 0;
            this.totalPaginas = 0;
          }
          this.isLoading = false;
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error al cargar logs de auditoría:', error);
          this.isLoading = false;
          this.spinner.hide();
          this.logs = [];
          this.totalRegistros = 0;
          this.totalPaginas = 0;
          
          // Determinar el mensaje de error más específico
          let mensajeError = 'No se pudieron cargar los logs de auditoría.';
          let mensajeDetalle = '';
          
          if (error?.status === 404) {
            mensajeError = 'El endpoint de auditoría no está disponible en el backend.';
            mensajeDetalle = 'Por favor, verifique que el backend tenga implementado el controlador de auditoría.';
          } else if (error?.status === 500) {
            mensajeError = 'Error interno del servidor al cargar los logs de auditoría.';
            mensajeDetalle = 'El endpoint existe pero hay un error en el servidor. Verifique los logs del backend.';
            if (error?.error?.message) {
              mensajeDetalle += `<br><small>Detalle: ${error.error.message}</small>`;
            }
          } else if (error?.status === 0) {
            mensajeError = 'No se pudo conectar con el servidor.';
            mensajeDetalle = 'Verifique que el backend esté ejecutándose en http://localhost:8000';
          } else if (error?.error?.message) {
            mensajeError = error.error.message;
            mensajeDetalle = 'Por favor, contacte al administrador del sistema.';
          } else if (error?.message) {
            mensajeError = error.message;
          }
          
          // Mostrar mensaje de error al usuario
          Swal.fire({
            title: 'Error al cargar logs',
            html: `<p><strong>${mensajeError}</strong></p>${mensajeDetalle ? `<p class="text-muted" style="font-size: 0.85em; margin-top: 10px;">${mensajeDetalle}</p>` : ''}`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            width: '600px'
          });
        }
      });
  }

  /**
   * Aplica los filtros y recarga los logs.
   */
  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.cargarLogs();
  }

  /**
   * Limpia todos los filtros y recarga los logs.
   */
  limpiarFiltros(): void {
    this.inicializarFormulario();
    this.paginaActual = 1;
    this.cargarLogs();
  }

  /**
   * Navega a la página anterior.
   */
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarLogs();
    }
  }

  /**
   * Navega a la página siguiente.
   */
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarLogs();
    }
  }

  /**
   * Navega a una página específica.
   * 
   * @param pagina Número de página
   */
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarLogs();
    }
  }

  /**
   * Formatea una fecha para mostrar en la tabla.
   * 
   * @param fecha Fecha a formatear
   * @returns String con la fecha formateada
   */
  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '-';
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Obtiene el rango final de registros mostrados en la página actual.
   * 
   * @returns Número del último registro mostrado
   */
  obtenerRangoFin(): number {
    return Math.min(this.paginaActual * this.tamanoPagina, this.totalRegistros);
  }

  /**
   * Obtiene la clase CSS según el tipo de evento.
   * 
   * @param tipoEvento Tipo de evento
   * @returns Clase CSS para el badge
   */
  obtenerClaseEvento(tipoEvento: string): string {
    const clases: { [key: string]: string } = {
      'LOGIN_FALLIDO': 'badge-danger',
      'LOGIN_EXITOSO': 'badge-success',
      'RECUPERACION_PASSWORD': 'badge-warning',
      'USUARIO_BLOQUEADO': 'badge-danger',
      'CAMBIO_PASSWORD': 'badge-info',
      'ACCESO_DENEGADO': 'badge-danger'
    };
    return clases[tipoEvento] || 'badge-secondary';
  }

  /**
   * Genera un array de números para la paginación.
   * 
   * @param total Total de páginas
   * @returns Array de números del 1 al total
   */
  generarArrayPaginas(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}


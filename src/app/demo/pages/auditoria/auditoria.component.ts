import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuditoriaService } from './service/auditoria.service';
import { AuditoriaLoginRq } from './models/auditoria-login-rq';
import { AuditoriaLoginRs } from './models/auditoria-login-rs';
import { AuditoriaLogin } from './models/auditoria-login';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * Componente para visualizar y filtrar logs de auditoría de inicio de sesión.
 * 
 * Características:
 * - Tabla dinámica con paginación
 * - Filtros por usuario, fecha y tipo de evento
 * - Actualización en tiempo real al cambiar filtros
 * - Ordenamiento por columnas
 * 
 * @author Sistema
 */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit, OnDestroy {
  
  filtrosForm: FormGroup;
  datos: AuditoriaLogin[] = [];
  respuesta: AuditoriaLoginRs | null = null;
  isLoading = false;
  
  // Configuración de paginación
  paginaActual = 0;
  tamanoPagina = 20;
  totalPaginas = 0;
  totalElementos = 0;
  
  // Subject para cancelar suscripciones
  private destroy$ = new Subject<void>();
  
  // Subject para debounce de búsqueda
  private searchSubject$ = new Subject<void>();
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auditoriaService: AuditoriaService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.filtrosForm = this.formBuilder.group({
      username: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      exitoso: [null] // null = todos, true = exitosos, false = fallidos
    });
  }
  
  ngOnInit(): void {
    // Configurar debounce para búsqueda en tiempo real
    this.searchSubject$.pipe(
      debounceTime(500), // Esperar 500ms después del último cambio
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.buscar();
    });
    
    // Cargar datos iniciales
    this.buscar();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Realiza la búsqueda de logs de auditoría con los filtros actuales.
   */
  buscar(): void {
    this.isLoading = true;
    this.spinner.show();
    
    const filtros: AuditoriaLoginRq = {
      username: this.filtrosForm.get('username')?.value?.trim() || undefined,
      fechaDesde: this.filtrosForm.get('fechaDesde')?.value || undefined,
      fechaHasta: this.filtrosForm.get('fechaHasta')?.value || undefined,
      exitoso: this.filtrosForm.get('exitoso')?.value,
      pagina: this.paginaActual,
      tamano: this.tamanoPagina,
      ordenarPor: 'fechaHora',
      direccion: 'DESC'
    };
    
    this.auditoriaService.consultarAuditoria(filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          this.respuesta = respuesta;
          this.datos = respuesta.contenido || [];
          this.totalPaginas = respuesta.totalPaginas || 0;
          this.totalElementos = respuesta.totalElementos || 0;
          this.paginaActual = respuesta.paginaActual || 0;
          this.isLoading = false;
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error al consultar auditoría:', error);
          this.datos = [];
          this.isLoading = false;
          this.spinner.hide();
        }
      });
  }
  
  /**
   * Se ejecuta cuando cambian los filtros para buscar en tiempo real.
   */
  onFiltroChange(): void {
    this.paginaActual = 0; // Resetear a la primera página
    this.searchSubject$.next();
  }
  
  /**
   * Limpia todos los filtros y recarga los datos.
   */
  limpiarFiltros(): void {
    this.filtrosForm.reset({
      username: '',
      fechaDesde: '',
      fechaHasta: '',
      exitoso: null
    });
    this.paginaActual = 0;
    this.buscar();
  }
  
  /**
   * Cambia a la página anterior.
   */
  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.buscar();
    }
  }
  
  /**
   * Cambia a la página siguiente.
   */
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.buscar();
    }
  }
  
  /**
   * Cambia a una página específica.
   */
  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.buscar();
    }
  }
  
  /**
   * Obtiene el texto del estado del evento.
   */
  getEstadoTexto(exitoso: boolean): string {
    return exitoso ? 'Exitoso' : 'Fallido';
  }
  
  /**
   * Obtiene la clase CSS para el badge de estado.
   */
  getEstadoClase(exitoso: boolean): string {
    return exitoso ? 'badge bg-success' : 'badge bg-danger';
  }
  
  /**
   * Formatea una fecha para mostrar.
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return fecha;
    }
  }
  
  /**
   * Obtiene el rango de elementos mostrados actualmente.
   */
  getRangoElementos(): string {
    if (this.totalElementos === 0) return '0 - 0';
    const inicio = (this.paginaActual * this.tamanoPagina) + 1;
    const fin = Math.min((this.paginaActual + 1) * this.tamanoPagina, this.totalElementos);
    return `${inicio} - ${fin}`;
  }
  
  /**
   * Obtiene las páginas visibles para la paginación (máximo 10).
   */
  getPaginasVisibles(): number[] {
    const maxVisible = 10;
    const paginas: number[] = [];
    
    if (this.totalPaginas <= maxVisible) {
      // Si hay 10 o menos páginas, mostrar todas
      for (let i = 0; i < this.totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la actual
      let inicio = Math.max(0, this.paginaActual - 4);
      let fin = Math.min(this.totalPaginas - 1, inicio + maxVisible - 1);
      
      // Ajustar inicio si estamos cerca del final
      if (fin - inicio < maxVisible - 1) {
        inicio = Math.max(0, fin - maxVisible + 1);
      }
      
      for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
      }
    }
    
    return paginas;
  }
}


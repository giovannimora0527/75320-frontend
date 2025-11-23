import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AuditoriaService } from './service/auditoria.service';
import { Auditoria } from './models/auditoria';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Componente de Auditoría.
 * * Este componente se encarga de visualizar el historial de auditoría del sistema.
 * Implementa una tabla de Angular Material con capacidades de:
 * - Paginación
 * - Ordenamiento (Sort)
 * - Filtrado global personalizado (por varios campos simultáneamente)
 * - Feedback visual de carga (Spinner)
 * * @export
 * @class AuditoriaComponent
 * @implements {AfterViewInit}
 */
@Component({
    selector: 'app-auditoria',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule
    ],
    templateUrl: './auditoria.component.html',
    styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements AfterViewInit {

    /**
     * Referencia al paginador de la tabla.
     * Se inicializa después de que la vista se carga (ngAfterViewInit).
     */
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    /**
     * Referencia al directiva de ordenamiento de la tabla.
     */
    @ViewChild(MatSort) sort!: MatSort;

    /** Instancia del modal de Bootstrap para acciones emergentes. */
    modalInstance: Modal | null = null;

    /** Controla el estado actual del formulario (ej. 'crear', 'editar'). */
    modoFormulario: string = '';

    /** Almacena la lista cruda de auditorías obtenida del servicio. */
    auditorias: Auditoria[] = [];

    /**
     * Fuente de datos para la tabla de Angular Material.
     * Encapsula los datos de `auditorias` y provee utilidades de filtro y paginación.
     */
    dataSource = new MatTableDataSource<Auditoria>([]);

    /** Texto a mostrar debajo del spinner de carga. */
    titleSpinner: string = "Cargando...";

    /**
     * Define las columnas que se renderizarán en la tabla y su orden.
     * Debe coincidir con los `matColumnDef` en el HTML.
     */
    displayedColumns: string[] = [
        'id',
        'username',
        'description',
        'transaccionFecha',
        'tipoAuditoria',
        'ipAddress'
    ];

    /**
     * Grupo de controles del formulario (Reactive Form).
     * @note Actualmente declarado pero no inicializado en el constructor.
     */
    form!: FormGroup; // Agregué '!' o '?' para evitar errores de TypeScript estricto si no se inicializa.

    /**
     * Constructor del componente.
     * Inicia la carga de registros inmediatamente al instanciar el componente.
     * * @param auditoriaService Servicio para peticiones HTTP relacionadas con auditoría.
     * @param spinner Servicio para mostrar/ocultar el loader de pantalla completa.
     */
    constructor(
        private readonly auditoriaService: AuditoriaService,
        private readonly spinner: NgxSpinnerService
    ) {
        this.listarTodosLosRegistros();
    }

    /**
     * Hook del ciclo de vida que se ejecuta después de iniciar la vista.
     * Es necesario para vincular el `paginator` y `sort` al `dataSource`,
     * ya que estos elementos no existen en el DOM durante el constructor o ngOnInit.
     */
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Configuración del predicado de filtro personalizado
        // Sobrescribe la lógica por defecto de Angular Material para buscar en columnas específicas
        this.dataSource.filterPredicate = (data: Auditoria, filter: string) => {
            const searchString = filter.trim().toLowerCase();
            return (
                data.username?.toLowerCase().includes(searchString) ||
                data.transaccionFecha?.toString().toLowerCase().includes(searchString) ||
                data.tipoAuditoria?.toLowerCase().includes(searchString) ||
                data.id?.toString()?.includes(searchString) || false // Fallback para seguridad
            );
        }
    }

    /**
     * Aplica el filtro a la tabla basado en el evento de entrada del usuario.
     * Convierte el texto a minúsculas y elimina espacios para normalizar la búsqueda.
     * Si hay resultados y paginación, regresa a la primera página.
     * * @param event Evento del DOM disparado por el input de búsqueda (keyup).
     */
    applyFilter(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target) return; // Validación de seguridad

        const filterValue = target.value.trim().toLowerCase();
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
     * Obtiene todos los registros de auditoría desde el backend.
     * * Flujo:
     * 1. Muestra el spinner.
     * 2. Llama al servicio.
     * 3. En éxito: Asigna datos al dataSource y oculta el spinner tras 3s (simulado).
     * 4. En error: Oculta el spinner inmediatamente y muestra alerta con Swal.
     */
    listarTodosLosRegistros() {
        this.spinner.show();

        this.auditoriaService.listarTodosLosRegistros().subscribe({
            next: (data) => {
                this.auditorias = data;
                // Nota: El timeout de 3000ms puede ser solo estético; considerar remover para producción
                setTimeout(() => this.spinner.hide(), 3000);
                this.dataSource.data = data;
            },
            error: (error) => {
                this.spinner.hide();
                Swal.fire('Error al listar los procesos', error);
            }
        });
    } 
    /*Emily*/
}
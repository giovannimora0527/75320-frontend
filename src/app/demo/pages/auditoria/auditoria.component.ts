import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { AuditoriaService } from './service/auditoria.service';
import { Auditoria } from './models/auditoria';
import { CommonModule } from '@angular/common';


// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

//Angular Material
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

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

    modalInstance: Modal | null = null;
    modoFormulario: string = '';
    auditorias: Auditoria[] = [];
    dataSource = new MatTableDataSource<Auditoria>([]);
    titleSpinner: string = "Cargando...";
    displayedColumns: string[] = [
        'id', 
        'username', 
        'description', 
        'transaccionFecha', 
        'tipoAuditoria', 
        'ipAddress'];

    form: FormGroup;

    constructor(
        private readonly auditoriaService: AuditoriaService,
        private readonly spinner: NgxSpinnerService
    ) {    
        this.listarTodosLosRegistros();   
    }
    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 


    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Auditoria, filter: string) => {
        const searchString = filter.trim().toLowerCase();
        return (
            data.username ?.toLowerCase().includes(searchString) ||
            data.transaccionFecha ?.toString().toLowerCase().includes(searchString) ||
            data.tipoAuditoria ?.toLowerCase().includes(searchString) ||
            data.id?.toString() ?.includes(searchString)
        );
    
    }

}

    applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;

    const filterValue = target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
    }
}

    listarTodosLosRegistros() {
    this.spinner.show();

    this.auditoriaService.listarTodosLosRegistros().subscribe({
        next: (data) => {
        this.auditorias = data;
        setTimeout(() => this.spinner.hide(), 3000)
        this.dataSource.data = data;


        },
        error: (error) => {
        this.spinner.hide();
        Swal.fire('Error al listar los procesos', error);
        
        }
    });
    }
}
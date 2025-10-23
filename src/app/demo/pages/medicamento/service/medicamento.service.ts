import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Medicamentos } from '../model/medicamento';
import { environment } from '../../../../../environments/environment';
import { MedicamentoRq } from '../model/respuesta';

@Injectable({
    providedIn: 'root'
})

export class MedicamentoService {   
    urlBase: string = environment.apiUrlAuth;
    urlApi: string = 'medicamento';

    constructor(private backendService: BackendService) {}

    listarMedicamentos(): Observable<Medicamentos[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
    } 
    guardarMedicamento(Medicamentos: Medicamentos): Observable<MedicamentoRq> {   
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', Medicamentos);
    }

    actualizarMedicamento(Medicamentos: Medicamentos): Observable<MedicamentoRq> {      
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', Medicamentos);
    }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';
import { RespuestaRs } from '../../usuario/models/respuesta';

@Injectable({
    providedIn: 'root'
})
export class MedicamentoService {
    urlBase: string = environment.apiUrlAuth;
    urlApi: string = 'medicamento';

    constructor(private backendService: BackendService) {}

    getMedicamentos(): Observable<Medicamento[]> {
        return this.backendService.get(this.urlBase, this.urlApi, 'listar');
    }

    guardarMedicamento(medicamento: Medicamento): Observable<RespuestaRs> {
        return this.backendService.post(this.urlBase, this.urlApi, 'guardar', medicamento);
    }

    actualizarMedicamento(medicamento: Medicamento): Observable<RespuestaRs> {
        return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', medicamento);
    }
}
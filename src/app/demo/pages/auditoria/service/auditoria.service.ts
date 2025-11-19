import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Auditoria } from '../models/auditoria';

@Injectable({
    providedIn: 'root'
})
export class AuditoriaService {
    urlBase = environment.apiUrl;
    endpoint: string = 'auditoria';

    constructor(private readonly backendService: BackendService) {}

    listarTodosLosRegistros(): Observable<Auditoria[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
    }

}
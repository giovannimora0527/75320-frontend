import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Receta} from '../models/receta';
import { environment } from './../../../../../environments/environment';
import { RecetaRq } from '../models/recetaRq';


@Injectable({
    providedIn: 'root'
})
export class RecetaService {
    urlBase: string = environment.apiUrlAuth;
    urlApi: string = 'receta';

    constructor(private backendService: BackendService) {}

    listarRecetas(): Observable<Receta[]> {
        // Asegúrate de que backendService.get construya correctamente la URL usando urlBase y urlApi
        return this.backendService.get(this.urlBase, this.urlApi, 'listar');
    }

    guardarRecetas(Receta: Receta): Observable<RecetaRq> {   
        // Igual aquí, revisa cómo backendService.post arma la URL final
        return this.backendService.post(this.urlBase, this.urlApi, 'guardar', Receta);
    }
}
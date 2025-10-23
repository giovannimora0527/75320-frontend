import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Recetas } from '../model/recetas';
import { environment } from './../../../../../environments/environment';
import { RecetaRq } from '../model/respuesta';


@Injectable({
    providedIn: 'root'
})

export class RecetaService {
    listarCitas() {
    throw new Error('Method not implemented.');
    }   
    urlBase: string = environment.apiUrlAuth;
    urlApi: string = 'receta';

    constructor(private backendService: BackendService) {}

    listarRecetas(): Observable<Recetas[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
    } 

    guardarReceta(Recetas: Recetas): Observable<RecetaRq> {   
    return this.backendService.post(this.urlBase, this.urlApi, 'guardar', Recetas);
    }

    actualizarReceta(Recetas: Recetas): Observable<RecetaRq> {      
    return this.backendService.post(this.urlBase, this.urlApi, 'actualizar', Recetas);
    }
}

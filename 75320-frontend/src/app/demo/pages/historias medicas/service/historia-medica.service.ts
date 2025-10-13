import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  private urlBase: string = environment.apiUrlAuth;
  private urlApi: string = 'historias';

  constructor(private backendService: BackendService) {}

  // Listar todas las historias
  getHistorias(): Observable<any[]> {
    return this.backendService.get(this.urlBase, this.urlApi, 'listar');
  }

  // Crear historia médica (POST a /crear)
  crearHistoria(historia: any): Observable<any> {
    return this.backendService.post(this.urlBase, this.urlApi, 'crear', historia);
  }

  // Actualizar historia
  actualizarHistoria(id: number, historia: any): Observable<any> {
    return this.backendService.put(this.urlBase, this.urlApi, `${id}`, historia);
  }

  // Eliminar historia
  eliminarHistoria(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.urlApi, `${id}`);
  }
}




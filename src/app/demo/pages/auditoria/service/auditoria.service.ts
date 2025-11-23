import { Injectable } from '@angular/core'; // Nota: Faltaba importar Injectable en tu snippet original
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Auditoria } from '../models/auditoria';

/**
 * Servicio de negocio para la entidad Auditoría.
 * * Actúa como una capa intermedia entre los componentes (como `AuditoriaComponent`)
 * y el servicio de comunicación HTTP genérico (`BackendService`).
 * * @providedIn 'root' - Este servicio es un Singleton instanciado en la raíz de la aplicación.
 */
@Injectable({
providedIn: 'root'
})
export class AuditoriaService {

/**
   * URL base del servidor API.
   * Se obtiene de las variables de entorno para facilitar el cambio entre desarrollo y producción.
   * @example 'http://localhost:8080/api'
   */
urlBase = environment.apiUrl;

/**
   * Endpoint específico del recurso.
   * Se concatena a la URL base para formar la ruta del controlador.
   */
endpoint: string = 'auditoria';

/**
   * Inicializa el servicio.
   * * @param backendService Servicio genérico (wrapper) para realizar peticiones HTTP (GET, POST, etc.).
   */
constructor(private readonly backendService: BackendService) {}

/**
   * Obtiene el listado completo de registros de auditoría.
   * * Construye la petición delegando en `BackendService` usando la estructura:
   * `{urlBase}/{endpoint}/listar`
   * * @returns {Observable<Auditoria[]>} Un Observable que emite un arreglo de objetos `Auditoria`.
   */
listarTodosLosRegistros(): Observable<Auditoria[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
}

}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  urlBase: string = environment.apiUrlAuth;

  constructor(private backendService: BackendService) {}

    formatDateToInput(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // formato compatible con <input type="date">
  }

  convertToIsoDate(fecha: string): string {
  if (!fecha) return '';
  // Si ya viene en formato YYYY-MM-DD, la devuelvo igual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;

  // Si viene en formato DD/MM/YYYY
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, "especializacion", 'listar'); 
  }
}

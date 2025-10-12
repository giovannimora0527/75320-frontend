import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent {
  menus = [
    {title: 'Usuarios', link: '/inicio/usuario'},
    {title: 'Médicos', link: '/inicio/medico'},
    {title: 'Pacientes', link: '/inicio/paciente'},
    {title: 'Medicamentos', link: '/inicio/medicamentos'},
    {title: 'Citas', link: '/inicio/citas'},
    {title: 'Especializaciones', link: '/inicio/especializaciones'}
  ];
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }} ,
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
       { path: 'medicamento', component: PacienteComponent, data: { title: 'Medicamento' }},
       { path: 'cita', component: PacienteComponent, data: { title: 'Cita' }} ,
       { path: 'historiamedica', component: PacienteComponent, data: { title: 'Historia Medica' }},
       { path: 'formulamedica', component: PacienteComponent, data: { title: 'Formulas' }},
       { path: 'gestionespecializacion', component: EspecializacionComponent, data: { title: 'Especializacion' }}     
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

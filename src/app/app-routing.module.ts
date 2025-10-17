import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
import { CitasComponent } from './demo/pages/citas/citas.component';
import { FormulasComponent } from './demo/pages/formulas/formulas.component';
import { HistoriasComponent } from './demo/pages/historias/historias.component';
import { EspecializacionesComponent } from './demo/pages/especializaciones/especializaciones.component';
import { LandingComponent } from './demo/pages/landing/landing.component';

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
       { path: '', component: LandingComponent, data: { title: 'Dashboard' }},
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }} ,
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
       { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' }},
       { path: 'citas', component: CitasComponent, data: { title: 'Citas' }},
       { path: 'formulas', component: FormulasComponent, data: { title: 'Fórmulas Médicas' }},
       { path: 'historias', component: HistoriasComponent, data: { title: 'Historias Médicas' }},
       { path: 'especializaciones', component: EspecializacionesComponent, data: { title: 'Especializaciones' }}     
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

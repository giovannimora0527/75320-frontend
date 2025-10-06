import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
//import { EspecializacionComponent } from './demo/pages/paciente/especializacion.component';
//import { HistoriaMedicaComponent } from './demo/pages/paciente/historiaMedicamneto.component';
//import { MedicamentosComponent } from './demo/pages/paciente/medicamentos.component';
//import { RecetasComponent } from './demo/pages/paciente/recetas.component';
import { CitaComponent } from './demo/pages/citas/cita.component';


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
       //{ path: 'especilizaciones', component: EspecializacionComponent, data: { title: 'Especializaciones' }},
       //{ path: 'historia_medica', component: HistoriaMedicaComponent, data: { title: 'Historia medica' }},
       //{ path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos }},
       //{ path: 'recetas', component: RecetasComponent, data: { title: 'Recetas' }},
        { path: 'citas', component: CitaComponent, data: { title: 'Citas' }},
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

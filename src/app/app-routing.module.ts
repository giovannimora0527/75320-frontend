import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { RecetaComponent } from './demo/pages/receta/receta.component';
import { CitaComponent } from './demo/pages/citas/cita.component';
import { MedicamentoComponent} from './demo/pages/medicamentos/medicamento.component';

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
        { path: 'receta', component: RecetaComponent, data: { title: 'Receta' }},
        { path: 'citas', component: CitaComponent, data: { title: 'Citas' }},
        { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Medicamento' }}
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

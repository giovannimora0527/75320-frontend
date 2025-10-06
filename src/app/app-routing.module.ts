import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { CitaComponent } from './demo/pages/cita/cita.component';
import { FormulamedicaComponent } from './demo/pages/formulamedica/formulamedica.component';
import { HistoriamedicaComponent } from './demo/pages/historiamedica/historiamedica.component';
import { GestionespecializacionComponent } from './demo/pages/gestionespecializacion/gestionespecializacion.component';
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
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }}, 
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},  
       { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Medicamento' }},  
       { path: 'cita', component: CitaComponent, data: { title: 'Cita' }}, 
       { path: 'formulamedica', component: FormulamedicaComponent, data: { title: 'Formulamedica' }},    
       { path: 'historiamedica', component: HistoriamedicaComponent, data: { title: 'Historiamedica' }}, 
       { path: 'gestionespecializacion', component: GestionespecializacionComponent, data: { title: 'Gestionespecializacion' }}, 
            
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

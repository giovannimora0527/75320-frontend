import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentoComponent } from './demo/pages/medicamentos/medicamentos.component';
import { CitaComponent } from './demo/pages/citas/cita.component';
import { HistoriaComponent } from './demo/pages/historias medicas/historias medicas.component';
import { FormulaComponent } from './demo/pages/formulas medicas/formula medica.component';
import { EspecializacionComponent } from './demo/pages/especializaciones/especializaciones.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio/usuario',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
       { path: '', redirectTo: 'usuario', pathMatch: 'full' },
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }} ,
       { path: 'medico', component: MedicoComponent, data: { title: 'Médico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }}, 
       { path: 'medicamentos', component: MedicamentoComponent, data: { title: 'Medicamento' }},
       { path: 'cita', component: CitaComponent, data: { title: 'Cita' }},
       { path: 'historia-clinica', component: HistoriaComponent, data: { title: 'Historia Clínica' }},
       { path: 'formulas-medicas', component: FormulaComponent, data: { title: 'Formulas' }},
       { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Especialización' }},   
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}





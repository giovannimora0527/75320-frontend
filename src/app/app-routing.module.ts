import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar componentes
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitaComponent } from './demo/pages/citas/cita.component';
import { EspecializacionComponent } from './demo/pages/especializaciones/especializaciones.component';
import { FormulaMedicaComponent } from './demo/pages/formulas medicas/formulas medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historias medicas/historias medicas.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: AdminComponent,
    children: [
      { path: 'usuario', component: UsuarioComponent },
      { path: 'medico', component: MedicoComponent },
      { path: 'paciente', component: PacienteComponent },
      { path: 'cita', component: CitaComponent },
      { path: 'especializacion', component: EspecializacionComponent },
      { path: 'formula-medica', component: FormulaMedicaComponent },
      { path: 'historia-medica', component: HistoriasMedicasComponent },
      { path: 'medicamento', component: MedicamentosComponent }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}



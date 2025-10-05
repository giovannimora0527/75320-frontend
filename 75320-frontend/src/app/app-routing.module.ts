import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 Importaciones de tus componentes
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitaComponent } from './demo/pages/citas/cita.component';
import { EspecializacionComponent } from './demo/pages/especializaciones/especializaciones.component';
import { FormulaMedicaComponent } from './demo/pages/formulas medicas/formulas medicas.component';
import { HistoriaMedicaComponent } from './demo/pages/historias medicas/historias medicas.component';
import { MedicamentoComponent } from './demo/pages/medicamentos/medicamentos.component';

// ✅ Exportamos las rutas si se usan en otros archivos
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
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' } },
      { path: 'medico', component: MedicoComponent, data: { title: 'Médico' } },
      { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' } },
      { path: 'cita', component: CitaComponent, data: { title: 'Gestión de Citas' } },
      { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Gestión de Especializaciones' } },
      { path: 'formula-medica', component: FormulaMedicaComponent, data: { title: 'Fórmulas Médicas' } },
      { path: 'historia-medica', component: HistoriaMedicaComponent, data: { title: 'Historias Médicas' } },
      { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Gestión de Medicamentos' } }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}



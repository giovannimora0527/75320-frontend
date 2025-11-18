import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitaComponent } from './demo/pages/cita/cita.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulaComponent } from './demo/pages/formula/formula.component';
import { HistoriaComponent } from './demo/pages/historia/historia.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { LoginComponent } from './demo/pages/login/login.component';
import { RecuperarContrasenaComponent } from './demo/pages/recuperar-contrasena/recuperar-contrasena.component';

// GUARDS
import { 
  authGuard, 
  loginGuard, 
  adminGuard, 
  medicoAdminGuard
} from './guards/guards';

export const routes: Routes = [

  // ============================
  // RUTA LOGIN
  // ============================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    data: { title: 'Login' }
  },

  // ============================
  // RUTA RECUPERAR CONTRASEÑA
  // ============================
  {
    path: 'recuperar-contrasena',
    component: RecuperarContrasenaComponent,
    data: { title: 'Recuperar Contraseña' }
  },

  // ============================
  // DASHBOARD
  // ============================
  {
    path: 'dashboard',
    redirectTo: 'inicio/cita',
    pathMatch: 'full'
  },

  {
    path: 'inicio',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { title: 'Dashboard' },
    children: [

      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [adminGuard],
        data: {
          title: 'Gestión de Usuarios',
          module: 'usuarios',
          roles: ['ADMIN']
        }
      },

      {
        path: 'medico',
        component: MedicoComponent,
        canActivate: [adminGuard],
        data: {
          title: 'Gestión de Médicos',
          module: 'medicos',
          roles: ['ADMIN']
        }
      },

      {
        path: 'paciente',
        component: PacienteComponent,
        canActivate: [medicoAdminGuard],
        data: {
          title: 'Gestión de Pacientes',
          module: 'pacientes',
          roles: ['ADMIN', 'MEDICO']
        }
      },

      {
        path: 'cita',
        component: CitaComponent,
        canActivate: [authGuard],
        data: {
          title: 'Gestión de Citas',
          module: 'citas',
          roles: ['ADMIN', 'MEDICO', 'PACIENTE']
        }
      },

      {
        path: 'medicamento',
        component: MedicamentoComponent,
        canActivate: [medicoAdminGuard],
        data: {
          title: 'Gestión de Medicamentos',
          module: 'medicamentos',
          roles: ['ADMIN', 'MEDICO']
        }
      },

      {
        path: 'formula-medica',
        component: FormulaComponent,
        canActivate: [medicoAdminGuard],
        data: {
          title: 'Fórmulas Médicas',
          module: 'formulas',
          roles: ['ADMIN', 'MEDICO']
        }
      },

      {
        path: 'historia-clinica',
        component: HistoriaComponent,
        canActivate: [medicoAdminGuard],
        data: {
          title: 'Historias Clínicas',
          module: 'historias',
          roles: ['ADMIN', 'MEDICO']
        }
      },

      {
        path: 'especializacion',
        component: EspecializacionComponent,
        canActivate: [adminGuard],
        data: {
          title: 'Especializaciones Médicas',
          module: 'especializaciones',
          roles: ['ADMIN']
        }
      },

      {
        path: '',
        redirectTo: 'cita',
        pathMatch: 'full'
      }
    ]
  },

  // ============================
  // 404
  // ============================
  { 
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

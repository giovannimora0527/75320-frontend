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
import { AuditoriaComponent } from './demo/pages/auditoria/auditoria.component';
import { LoginComponent } from './demo/pages/login/login.component';

// Importar los guards
import { 
  authGuard, 
  loginGuard, 
  adminGuard, 
  medicoAdminGuard
} from './guards/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },  
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard], // Evita que usuarios autenticados accedan al login
    data: { title: 'Login' }
  },
  {
    path: 'dashboard',
    redirectTo: 'inicio/cita', // Redirigir al módulo de citas por defecto
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: AdminComponent,
    canActivate: [authGuard], // Requiere autenticación para acceder al área administrativa
    data: { title: 'Dashboard' },
    children: [      
        { 
          path: 'usuario', 
          component: UsuarioComponent, 
         canActivate: [adminGuard], // Solo administradores
          data: { 
          title: 'Gestión de Usuarios',
          module: 'usuarios',
          roles: ['ADMIN']
        }
      },
      { 
          path: 'medico', 
          component: MedicoComponent, 
         canActivate: [adminGuard], // Solo administradores
          data: { 
          title: 'Gestión de Médicos',
          module: 'medicos',
          roles: ['ADMIN']
        }
      },
      { 
          path: 'paciente', 
          component: PacienteComponent, 
         canActivate: [medicoAdminGuard], // Médicos y administradores
          data: { 
          title: 'Gestión de Pacientes',
          module: 'pacientes',
          roles: ['ADMIN', 'MEDICO']
        }
      },
      { 
          path: 'cita', 
          component: CitaComponent, 
         canActivate: [authGuard], // Cualquier usuario autenticado
          data: { 
          title: 'Gestión de Citas',
          module: 'citas',
          roles: ['ADMIN', 'MEDICO', 'PACIENTE']
        }
      },
      { 
          path: 'medicamento', 
          component: MedicamentoComponent, 
         canActivate: [medicoAdminGuard], // Médicos y administradores
          data: { 
          title: 'Gestión de Medicamentos',
          module: 'medicamentos',
          roles: ['ADMIN', 'MEDICO']
        }
      },
      { 
          path: 'formula-medica', 
          component: FormulaComponent, 
         canActivate: [medicoAdminGuard], // Médicos y administradores
          data: { 
          title: 'Fórmulas Médicas',
          module: 'formulas',
          roles: ['ADMIN', 'MEDICO']
        }
      },
      { 
          path: 'historia-clinica', 
          component: HistoriaComponent, 
         canActivate: [medicoAdminGuard], // Médicos y administradores
          data: { 
          title: 'Historias Clínicas',
          module: 'historias',
          roles: ['ADMIN', 'MEDICO']
        }
      },
      { 
          path: 'especializacion', 
          component: EspecializacionComponent, 
         canActivate: [adminGuard], // Solo administradores
          data: { 
          title: 'Especializaciones Médicas',
          module: 'especializaciones',
          roles: ['ADMIN']
        }
      },
      { 
          path: 'auditoria', 
          component: AuditoriaComponent, 
         canActivate: [adminGuard], // Solo administradores
          data: { 
          title: 'Auditoría',
          module: 'auditoria',
          roles: ['ADMIN']
        }
      },
      {
          path: '',
          redirectTo: 'cita', // Redirigir a citas por defecto
          pathMatch: 'full'
      }
    ]
  },
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

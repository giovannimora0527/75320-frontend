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
import { RecuperarPasswordComponent } from './demo/pages/recuperar-password/recuperar-password.component';


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


  // nueva ruta para recuperar contraseña
  {
    path: 'recuperar-password',                    
    component: RecuperarPasswordComponent,         
    canActivate: [loginGuard],                     
    data: { title: 'Recuperar Contraseña' }       
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

         data: { 
           title: 'Gestión de Usuarios',
           module: 'usuarios',
           roles: ['ADMIN']
         }
       },
       { 
         path: 'medico', 
         component: MedicoComponent, 

         data: { 
           title: 'Gestión de Médicos',
           module: 'medicos',
           roles: ['ADMIN']
         }
       },
       { 
         path: 'paciente', 
         component: PacienteComponent, 
         data: { 
           title: 'Gestión de Pacientes',
           module: 'pacientes',
           roles: ['ADMIN', 'MEDICO']
         }
       },
       { 
         path: 'cita', 
         component: CitaComponent, 
         data: { 
           title: 'Gestión de Citas',
           module: 'citas',
           roles: ['ADMIN', 'MEDICO', 'PACIENTE']
         }
       },
       { 
         path: 'medicamento', 
         component: MedicamentoComponent, 
         data: { 
           title: 'Gestión de Medicamentos',
           module: 'medicamentos',
           roles: ['ADMIN', 'MEDICO']
         }
       },
       { 
         path: 'formula-medica', 
         component: FormulaComponent, 
         data: { 
           title: 'Fórmulas Médicas',
           module: 'formulas',
           roles: ['ADMIN', 'MEDICO']
         }
       },
       { 
         path: 'historia-clinica', 
         component: HistoriaComponent, 
         data: { 
           title: 'Historias Clínicas',
           module: 'historias',
           roles: ['ADMIN', 'MEDICO']
         }
       },
       { 
         path: 'especializacion', 
         component: EspecializacionComponent, 
         data: { 
           title: 'Especializaciones Médicas',
           module: 'especializaciones',
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

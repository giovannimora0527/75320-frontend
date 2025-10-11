export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usuario',
        title: 'Gestión de Usuarios',
        type: 'item',
        url: '/inicio/usuario',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      /* ---------- Nuevos menus aqui -------------  */
      {
        id: 'medico',
        title: 'GESTION MEDICOS',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'paciente',
        title: 'GESTION PACIENTES',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      /*Buen dia, para el desarrollo de 
      esta tarea es necesario crear los 
      menus y los componentes faltantes.
       Medicamentos, Citas, Formulas Medicas,
        Historias Medicas, Gestión de especializaciones.*/

      {
        id: 'medicamento',
        title: 'GESTION MEDICAMENTOS',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-crosshair',
        classes: 'nav-item'
      },

      {
        id: 'cita',
        title: 'GESTION CITAS',
        type: 'item',
        url: '/inicio/cita',
        icon: 'feather icon-calendar',
        classes: 'nav-item'
      },
      {
        id: 'formulamedica',
        title: 'GESTION FORMULA MEDICA',
        type: 'item',
        url: '/inicio/formulamedica',
        icon: 'feather icon-file-text',
        classes: 'nav-item'
      },
      {
        id: 'historiamedica',
        title: 'GESTION HISTORIA MEDICA',
        type: 'item',
        url: '/inicio/historiamedica',
        icon: 'feather icon-folder',
        classes: 'nav-item'
      },
      {
        id: 'gestionespecializacion',
        title: 'GESTION ESPECIALIZACION',
        type: 'item',
        url: '/inicio/gestionespecializacion',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
    ]
  },
  
];

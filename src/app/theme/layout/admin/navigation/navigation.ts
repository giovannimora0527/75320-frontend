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
      {
        id: 'medico',
        title: 'Gestión de Medicos',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'paciente',
        title: 'Gestión de Pacientes',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'medicamento',
        title: 'Gestión de medicamentos',
        type: 'item',
        url: '/inicio/medicamento',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'cita',
        title: 'Gestión de citas',
        type: 'item',
        url: '/inicio/cita',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'formula',
        title: 'Gestión de formulas medicas',
        type: 'item',
        url: '/inicio/formula-medica',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'historia',
        title: 'Gestión de historias clinicas',
        type: 'item',
        url: '/inicio/historia-clinica',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'especializacion',
        title: 'Gestión de especializaciones',
        type: 'item',
        url: '/inicio/especializacion',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      }
    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];

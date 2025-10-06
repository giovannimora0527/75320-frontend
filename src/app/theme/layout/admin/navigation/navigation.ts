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
        title: 'Gestión de medicos',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'paciente',
        title: 'Gestión de pacientes',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'medicamento',
        title: 'Gestión de medicamentos',
        type: 'item',
        url: '/inicio/medicamento',
        icon: 'feather icon-package',
        classes: 'nav-item'
      },
      {
        id: 'cita',
        title: 'Gestión de citas',
        type: 'item',
        url: '/inicio/cita',
        icon: 'feather icon-calendar',
        classes: 'nav-item'
      },
      {
        id: 'formulamedica',
        title: 'Gestión de formulas medicas',
        type: 'item',
        url: '/inicio/formulamedica',
        icon: 'feather icon-file-text',
        classes: 'nav-item'
      },
      {
        id: 'historiamedica',
        title: 'Gestión de historias medicas',
        type: 'item',
        url: '/inicio/historiamedica',
        icon: 'feather icon-folder',
        classes: 'nav-item'
      },
      {
        id: 'gestionespecializacion',
        title: 'Gestión de especializaciones',
        type: 'item',
        url: '/inicio/gestionespecializacion',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
    ]
  },
  
];

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
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'especializacion',
        title: 'Gestión de Especializaciones',
        type: 'item',
        url: '/inicio/especializacion',
        icon: 'feather icon-shield',
        classes: 'nav-item'
      },
      {
        id: 'cita',
        title: 'Gestión de Citas',
        type: 'item',
        url: '/inicio/cita',
        icon: 'feather icon-calendar',
        classes: 'nav-item'
      },
      {
        id: 'medicamento',
        title: 'Gestión de Medicamentos',
        type: 'item',
        url: '/inicio/medicamento',
        icon: 'feather icon-pills',
        classes: 'nav-item'
      },
      {
        id: 'formula_medica',
        title: 'Gestión de Formulas Medicas',
        type: 'item',
        url: '/inicio/formula_medica',
        icon: 'feather icon-file-text',
        classes: 'nav-item'
      },
      {
        id: 'historia_medica',
        title: 'Gestión de Historias Medicas',
        type: 'item',
        url: '/inicio/historia_medica',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
    ]
  },
  
];

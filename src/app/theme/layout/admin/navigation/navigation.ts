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
        id: 'recetas',
        title: 'Gestión de Recetas',
        type: 'item',
        url: '/inicio/receta',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'medicamentos',
        title: 'Gestión de medicamentos',
        type: 'item',
        url: '/inicio/medicamento',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },

      {
        id: 'citas',
        title: 'Gestión de citas',
        type: 'item',
        url: '/inicio/citas',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
    ]
  },
  
];

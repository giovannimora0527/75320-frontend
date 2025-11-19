// Angular Import
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';

// project import
import { NavigationItem, navigationItems } from 'src/app/theme/layout/admin/navigation/navigation';
import { SharedModule } from '../../shared.module';

interface titleType {
  url: string | boolean | any | undefined;
  title: string;
  breadcrumbs: unknown;
  type: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  private route = inject(Router);
  private titleService = inject(Title);

  @Input() type: string = 'theme1';

  navigations: NavigationItem[] = navigationItems;
  breadcrumbList: string[] = [];
  navigationList!: titleType[];

  constructor() {
    this.setBreadcrumb();
  }

  // PUBLIC: Actualiza breadcrumbs cuando cambia la ruta
  setBreadcrumb() {
    this.route.events.subscribe((router: Event) => {
      if (router instanceof NavigationEnd) {
        const activeLink = router.url;
        const breadcrumbList = this.filterNavigation(this.navigations, activeLink);
        this.navigationList = breadcrumbList;

        const title = breadcrumbList[breadcrumbList.length - 1]?.title || 'Welcome';
        this.titleService.setTitle('Clínica - Uniminuto | ' + title);
      }
    });
  }

  // Busca coincidencia en menú y arma el breadcrumb
  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType[] {
    for (const navItem of navItems) {
      // Ítem directo
      if (navItem.type === 'item' && navItem.url === activeLink) {
        return [
          {
            url: navItem.url,
            title: navItem.title,
            breadcrumbs: navItem.breadcrumbs ?? true,
            type: navItem.type
          }
        ];
      }

      // Grupo o colapsable con hijos
      if ((navItem.type === 'group' || navItem.type === 'collapse') && navItem.children) {
        const breadcrumbList = this.filterNavigation(navItem.children, activeLink);

        if (breadcrumbList.length > 0) {
          breadcrumbList.unshift({
            url: navItem.url ?? false,
            title: navItem.title,
            breadcrumbs: navItem.breadcrumbs ?? true,
            type: navItem.type
          });
          return breadcrumbList;
        }
      }
    }

    return [];
  }
}

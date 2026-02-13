import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Muestreo',
      separator: false,
      items: [
    
        // {
        //   icon: 'assets/icons/heroicons/outline/cube.svg',
        //   label: 'Gestion Muestreo',
        //   route: '/components',
        //   children: [{ label: 'Parte de Muestreo', route: '/components/table' }],
          
        // },
         {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Movimientos',
          route: '/components',
          children: [{ label: 'Proyecto', route: '/components/proyectos' }],
          
        },
      ],
    },
    
  ];
}

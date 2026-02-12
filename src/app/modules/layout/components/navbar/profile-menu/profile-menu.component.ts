import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AuthService } from 'src/app/core/services/auth';


@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  
  public isOpen = false;
  public profileMenu = [
     
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      action: ()=> this.logout(),
    },
  ];

   constructor(
    private authService: AuthService,
    private router : Router,
    public themeService: ThemeService
  ) { }

  
logout(): void {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/auth/sign-in']);
    },
    error: (err) => {
      console.error('Error al cerrar sesión', err);
    }
  });
}
  public themeColors = [
    {
      name: 'base', 
      code: '#00049e',
    },
    
  ];

  public themeMode = ['light', 'dark'];
  public themeDirection = ['ltr', 'rtl'];


  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }

  setDirection(value: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, direction: value };
    });
  }
}

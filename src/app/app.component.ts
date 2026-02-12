import { Component, DOCUMENT, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ThemeService } from './core/services/theme.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster],
})
export class AppComponent {
  title = 'Gestion Muestreo';
 constructor(@Inject(DOCUMENT) private document: Document, public themeService: ThemeService) {
    this.document.defaultView?.addEventListener('pageshow', (event: any) => {
      if (event.persisted) {
        window.location.reload();
      }
    });
  }
}

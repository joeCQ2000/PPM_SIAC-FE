import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';               
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,                                               
    AuthRoutingModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()
  )                
  ]
})
export class AuthModule {}
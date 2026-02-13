import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UikitComponent } from './uikit.component';
import { TableComponent } from './pages/table/table.component';
import { MuestreoPescaComponent } from './pages/muestreo_pesca/muestreo_pesca.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ProyectoComponent } from './pages/proyectos/proyecto.component';

const routes: Routes = [
  {
    path: '',
    component: UikitComponent,
    children: [
      { path: '', redirectTo: 'components', pathMatch: 'full' },
      { path: 'table', component: TableComponent },
       { path: 'muestreo_pesca', component: MuestreoPescaComponent },
       {path: 'proyectos', component: ProyectoComponent},
        { path: 'muestreo_pesca/:id', component: MuestreoPescaComponent },
        { path: 'muestreo_pesca/:id/ver', component: MuestreoPescaComponent }, 
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UikitRoutingModule {}

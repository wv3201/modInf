import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './informes/informes.component';


const routes: Routes = [
  { path: 'index', redirectTo: '', pathMatch: 'full' },
  { path: '', redirectTo:'informes/MjQ0MTQ0LDMxNDUzMCwzMTQ1MjMsMzE0NTM5',pathMatch:'full' },
  { path: 'informes/:id', component: InformesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

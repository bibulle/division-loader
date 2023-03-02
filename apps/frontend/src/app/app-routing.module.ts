import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToBeDefinedComponent } from './to-be-defined/to-be-defined.component';
import { ToBeDefinedModule } from './to-be-defined/to-be-defined.module';
import { HomeModule } from './home/home.module';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      label: 'overview',
      menu: true,
      icon: 'home',
    },
  },
  {
    path: 'time',
    component: ToBeDefinedComponent,
    data: {
      label: 'time-played',
      menu: true,
      icon: 'watch',
    },
  },
  {
    path: 'level',
    component: ToBeDefinedComponent,
    data: {
      label: 'level',
      menu: true,
      icon: 'level',
    },
  },
  {
    path: 'pve-kills',
    component: ToBeDefinedComponent,
    data: {
      label: 'pve-kills',
      menu: true,
      icon: 'pve',
    },
  },
  {
    path: 'pvp-kills',
    component: ToBeDefinedComponent,
    data: {
      label: 'pvp-kills',
      menu: true,
      icon: 'dark-zone',
    },
  },
  // Show the 404 page for any routes that don't exist.
  {
    path: '**',
    component: ToBeDefinedComponent,
    data: {
      label: 'route.not-found',
      menu: false,
    },
  },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes), ToBeDefinedModule, HomeModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

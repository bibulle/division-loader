import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToBeDefinedComponent } from './to-be-defined/to-be-defined.component';
import { ToBeDefinedModule } from './to-be-defined/to-be-defined.module';
import { HomeModule } from './home/home.module';
import { HomeComponent } from './home/home.component';
import { TimePlayedComponent } from './curves/time-played/time-played.component';
import { CurvesModule } from './curves/curves.module';
import { LevelComponent } from './curves/level/level.component';
import { PveKillsComponent } from './curves/pve-kills/pve-kills.component';
import { PvpKillsComponent } from './curves/pvp-kills/pvp-kills.component';
import { StatsComponent } from './curves/stats/stats.component';

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
    component: TimePlayedComponent,
    data: {
      label: 'time-played',
      menu: true,
      icon: 'watch',
    },
  },
  {
    path: 'level',
    component: LevelComponent,
    data: {
      label: 'level',
      menu: true,
      icon: 'level',
    },
  },
  {
    path: 'pve-kills',
    component: PveKillsComponent,
    data: {
      label: 'pve-kills',
      menu: true,
      icon: 'pve',
    },
  },
  {
    path: 'pvp-kills',
    component: PvpKillsComponent,
    data: {
      label: 'pvp-kills',
      menu: true,
      icon: 'dark-zone',
    },
  },
  {
    path: 'stats/:stat_name',
    component: StatsComponent,
    data: {
      label: 'stats',
      menu: false,
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
  imports: [RouterModule.forRoot(routes), ToBeDefinedModule, HomeModule, CurvesModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

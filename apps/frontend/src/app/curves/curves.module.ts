import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePlayedComponent } from './time-played/time-played.component';
import { GraphComponent } from './graph/graph.component';
import { LevelComponent } from './level/level.component';
import { PveKillsComponent } from './pve-kills/pve-kills.component';
import { PvpKillsComponent } from './pvp-kills/pvp-kills.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [TimePlayedComponent, GraphComponent, LevelComponent, PveKillsComponent, PvpKillsComponent, StatsComponent],
  imports: [CommonModule],
})
export class CurvesModule {}

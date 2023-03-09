import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CharacterStats, StatDescription } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { CurvesService } from '../curves.service';

@Component({
  selector: 'division-loader-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  statName?: StatDescription;
  private _currentStatsSubscription: Subscription | undefined;

  characters: CharacterStats[] = [];

  constructor(private readonly _route: ActivatedRoute, private readonly _curvesService: CurvesService, private _router: Router) {
    this._router.events.subscribe((data) => {
      // console.log(data);
      if (data instanceof NavigationEnd) {
        const statKey = this._route.snapshot.paramMap.get('stat_name');

        this._curvesService
          .getStatDescription(statKey ? statKey : 'timePlayed')
          .then((stat) => {
            this.statName = stat;
          })
          .catch((reason) => {
            console.error(reason);
          });
      }
    });
  }

  ngOnInit() {
    console.log(this._route.snapshot.paramMap);

    // const stat = this._route.snapshot.paramMap.get('stat_name');
    // this.statName = stat !== null ? stat : undefined;

    this._currentStatsSubscription = this._curvesService.currentStatsObservable().subscribe((stats: CharacterStats[]) => {
      this.characters = stats;

      console.log(this.characters);
    });
    this._curvesService.startLoadingStats();
  }

  ngOnDestroy(): void {
    if (this._currentStatsSubscription) {
      this._currentStatsSubscription.unsubscribe();
    }
  }
}

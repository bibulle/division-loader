import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterStats, GraphTypeKey } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { CurvesService } from '../curves.service';

@Component({
  selector: 'division-loader-time-played',
  templateUrl: './time-played.component.html',
  styleUrls: ['./time-played.component.scss'],
})
export class TimePlayedComponent implements OnInit, OnDestroy {
  private _currentStatsSubscription: Subscription | undefined;

  characters: CharacterStats[] = [];
  graphType = GraphTypeKey.TIME;

  constructor(private readonly _curvesService: CurvesService) {}

  ngOnInit() {
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

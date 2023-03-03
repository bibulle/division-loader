import { Component } from '@angular/core';
import { CharacterStats, GraphTypeKey } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { CurvesService } from '../curves.service';

@Component({
  selector: 'division-loader-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent {
  private _currentStatsSubscription: Subscription | undefined;

  characters: CharacterStats[] = [];
  graphType = GraphTypeKey.LEVEL;

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

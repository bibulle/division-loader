import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharacterStats } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { HomeService } from './home.service';

@Component({
  selector: 'division-loader-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _currentStatsSubscription: Subscription | undefined;
  stats: CharacterStats[] = [];

  isOpen: { [cat: string]: boolean } = {};

  constructor(private readonly _homeService: HomeService) {}

  ngOnInit() {
    this._currentStatsSubscription = this._homeService.currentStatsObservable().subscribe((stats: CharacterStats[]) => {
      this.stats = stats;

      // console.log(this.stats);
    });

    this._homeService.startLoadingStats();
  }

  ngOnDestroy(): void {
    this._currentStatsSubscription?.unsubscribe();
  }
}

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CharacterStats, Stat } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'division-loader-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.scss'],
})
export class HomeUserComponent implements OnInit, OnDestroy {
  @Input() characterStat!: CharacterStats;

  @Input() isOpen: { [cat: string]: boolean } = {};

  categories = ['general', 'pve', 'darkZone', 'conflictPvp', 'kills'];

  private _currentStatsSortingSubscription: Subscription | undefined;
  private _statsSorting: { [cat: string]: string[] } = {};

  constructor(private _homeService: HomeService) {}

  ngOnInit() {
    this._currentStatsSortingSubscription = this._homeService.currentStatsSortingObservable().subscribe((statsSorting) => {
      this._statsSorting = statsSorting;
    });
  }

  ngOnDestroy(): void {
    this._currentStatsSortingSubscription?.unsubscribe();
  }

  getStat(category: string): Stat[] {
    const lst = Object.values(this.characterStat.stats).filter((s) => s.category === category && s.value !== null);
    if (!this._statsSorting[category]) {
      this._statsSorting[category] = lst.map((s) => s.displayName);
      this._homeService.initStatSort(this._statsSorting);
    }

    return lst.sort((a, b) => this._statsSorting[category].indexOf(a.displayName) - this._statsSorting[category].indexOf(b.displayName));
  }

  dragDropped(category: string, $event: CdkDragDrop<number>) {
    // console.log(category)
    // console.log($event.previousContainer.data)
    // console.log($event.container.data)
    if ($event.previousContainer.data >= $event.container.data) {
      this._homeService.sortStat(category, $event.previousContainer.data, $event.container.data);
    } else {
      this._homeService.sortStat(category, $event.previousContainer.data, $event.container.data - 1);
    }
    // }
  }
}

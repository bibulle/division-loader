import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiReturn, CharacterStats } from '@division-loader/apis';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  static KEY_STATS_SORTING_LOCAL_STORAGE = 'statsSorting';

  private static _refreshStatsIsRunning = false;
  private static REFRESH_STATS_EVERY = 10 * 60 * 1000;

  private _stats: CharacterStats[] = [];
  private _statsSubject: BehaviorSubject<CharacterStats[]> = new BehaviorSubject(this._stats);

  private _statSorting: { [cat: string]: string[] } = {};
  private _statSortingSubject: BehaviorSubject<{ [cat: string]: string[] }>;

  constructor(private _http: HttpClient) {
    this.startLoadingStats();

    this._loadStatsSortingFromLocalStorage();
    // console.log(this._statSorting);
    this._statSortingSubject = new BehaviorSubject(this._statSorting);
  }

  currentStatsObservable(): Observable<CharacterStats[]> {
    return this._statsSubject;
  }

  startLoadingStats() {
    console.log('startLoadingStats');
    if (!HomeService._refreshStatsIsRunning) {
      setTimeout(() => {
        this.refreshStats();
      }, 0);
    }
  }

  refreshStats() {
    console.log('refreshStats');

    // If no observer, do not refresh
    if (this._statsSubject.observed) {
      HomeService._refreshStatsIsRunning = true;

      this._http.get<ApiReturn>('/api/stats').subscribe((data) => {
        this._stats = data.data as CharacterStats[];
        this._statsSubject.next(this._stats);

        setTimeout(() => {
          this.refreshStats();
        }, HomeService.REFRESH_STATS_EVERY);
        HomeService._refreshStatsIsRunning = false;
      });
    } else {
      HomeService._refreshStatsIsRunning = false;
    }
  }

  initStatSort(ss: { [cat: string]: string[] }) {
    this._statSorting = ss;
  }
  currentStatsSortingObservable(): Observable<{ [cat: string]: string[] }> {
    return this._statSortingSubject;
  }
  sortStat(category: string, previousIndex: number, index: number) {
    moveItemInArray(this._statSorting[category], previousIndex, index);
    this._statSortingSubject.next(this._statSorting);
    this._saveStatsSortingToLocalStorage();
  }

  private _loadStatsSortingFromLocalStorage() {
    try {
      const ls = localStorage.getItem(HomeService.KEY_STATS_SORTING_LOCAL_STORAGE);
      if (!ls) {
        this._statSorting = HomeService.STATS_SORT_DEFAULT;
      } else {
        this._statSorting = JSON.parse(ls) as { [cat: string]: string[] };
      }
    } catch {
      this._statSorting = HomeService.STATS_SORT_DEFAULT;
    }
  }

  private _saveStatsSortingToLocalStorage() {
    localStorage.setItem(HomeService.KEY_STATS_SORTING_LOCAL_STORAGE, JSON.stringify(this._statSorting));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static readonly STATS_SORT_DEFAULT = {
    general: [
      'Time Played',
      'PvP Kills',
      'NPC Kills',
      'Skill Kills',
      'Headshots',
      'Total XP',
      'Clan XP',
      'E-Credit Balance',
      'Items Looted',
      'Sharpshooter Kills',
      'Survivalist Kills',
      'Demolitionist Kills',
      'Commendations',
      'Curr Comm. Score',
    ],
    pve: ['Time Played', 'Player Level', 'PvE XP', 'Gear Score', 'Named Kills', 'Elite Kills', 'Hyena Kills', 'TrueSons Kills', 'OutCasts Kills', 'BlackTusk Kills'],
    darkZone: [
      'Time Played',
      'DZ Level',
      'DZ XP',
      'Rogue Time Played',
      'Rogue Longest Time Played',
      'Rogues Killed',
      'Elite Kills',
      'Named Kills',
      'Hyena Kills',
      'TrueSons Kills',
      'OutCasts Kills',
      'BlackTusk Kills',
    ],
    conflictPvp: ['Time Played', 'Conflict Rank', 'Conflict XP'],
    kills: ['Bleeding Kills', 'Burning Kills', 'Shocked Kills', 'Ensnare Kills', 'Headshot Kills', 'Shotgun Kills', 'SMG Kills', 'Turret Kills', 'Pistol Kills', 'Rifle Kills', 'Grenade Kills'],
  };
}

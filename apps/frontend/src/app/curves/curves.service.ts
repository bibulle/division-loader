import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterStats, ApiReturn, StatDescription, CategoryDescription } from '@division-loader/apis';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurvesService {
  private static _refreshStatsIsRunning = false;
  private static REFRESH_STATS_EVERY = 10 * 60 * 1000;

  private _stats: CharacterStats[] = [];
  private _statsSubject: BehaviorSubject<CharacterStats[]> = new BehaviorSubject(this._stats);

  constructor(private _http: HttpClient) {
    // this.startLoadingStats();
  }

  currentStatsObservable(): Observable<CharacterStats[]> {
    return this._statsSubject;
  }

  startLoadingStats() {
    console.log('startLoadingStats');
    if (!CurvesService._refreshStatsIsRunning) {
      setTimeout(() => {
        this.refreshStats();
      }, 0);
    }
  }

  refreshStats() {
    console.log('refreshStats');

    // If no observer, do not refresh
    if (this._statsSubject.observed) {
      CurvesService._refreshStatsIsRunning = true;

      this._http.get<ApiReturn>('/api/stats').subscribe((data) => {
        this._stats = (data.data as CharacterStats[]).map((cs) => {
          cs.dateStart = new Date(cs.dateStart);
          cs.dateEnd = new Date(cs.dateEnd);
          return cs;
        });
        this._statsSubject.next(this._stats);

        setTimeout(() => {
          this.refreshStats();
        }, CurvesService.REFRESH_STATS_EVERY);
        CurvesService._refreshStatsIsRunning = false;
      });
    } else {
      CurvesService._refreshStatsIsRunning = false;
    }
  }

  getStatDescription(key: string): Promise<StatDescription> {
    return new Promise<StatDescription>((resolve) => {
      this._http.get<ApiReturn>('/api/stats/description').subscribe((data) => {
        const descriptions = data.data as CategoryDescription[];

        const description = descriptions.flatMap((cd) => cd.descriptions).find((description) => description.key === key);

        if (description) {
          resolve(description);
        } else {
          resolve({ key: 'timePlayed', displayName: 'Time Played', description: '' });
        }
      });
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiReturn, StatDescription } from '@division-loader/apis';
import { BehaviorSubject, Observable } from 'rxjs';

export enum LoadingState {
  OFF,
  WAITING_30,
  LOADING,
}

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private loadingSubject: BehaviorSubject<number>;
  private loadingState = LoadingState.OFF;
  private loadingStateWaitingDate?: Date = undefined;
  private loadingStateLoadingDate?: Date = undefined;
  timerId?: NodeJS.Timer;

  constructor(private _http: HttpClient) {
    this.loadingSubject = new BehaviorSubject<number>(this._calculateLoadingState());

    this._launchInterval();
  }

  /**
   * Get the observable on loadingState changes
   *       -1      : no waiting,
   *       0       : loading,
   *       n       : waiting (still n seconds)
   *       -n < -1 : Should have been loaded n secondes ago
   * @returns {Observable<number>}
   */
  loadingObservable(): Observable<number> {
    return this.loadingSubject.pipe();
  }

  setState(loadingState: LoadingState) {
    this.loadingState = loadingState;
    this.loadingSubject.next(this._calculateLoadingState());
  }

  private _calculateLoadingState(): number {
    switch (this.loadingState) {
      case LoadingState.OFF:
        this.loadingStateWaitingDate = undefined;
        this.loadingStateLoadingDate = undefined;
        // off
        return -1;
      case LoadingState.LOADING: {
        if (!this.loadingStateLoadingDate) {
          this._launchInterval();
          this.loadingStateLoadingDate = new Date();
        }
        const timeSineLoading = Math.round((new Date().getTime() - this.loadingStateLoadingDate.getTime()) / 1000);
        if (timeSineLoading > 30) {
          // Error
          return -timeSineLoading;
        } else {
          // Loading
          return 0;
        }
      }
      case LoadingState.WAITING_30: {
        this.loadingStateLoadingDate = undefined;
        if (!this.loadingStateWaitingDate) {
          this._launchInterval();
          this.loadingStateWaitingDate = new Date();
          this.loadingStateWaitingDate.setSeconds(this.loadingStateWaitingDate.getSeconds() + 30);
        }
        let ret = Math.round((this.loadingStateWaitingDate.getTime() - new Date().getTime()) / 1000);

        // error margin ;-)
        if (-10 < ret && ret <= 0) {
          ret = 1;
        }
        // waiting
        return ret;
      }
    }
  }

  private _launchInterval() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setInterval(() => {
      this.loadingSubject.next(this._calculateLoadingState());
    }, 10000);
  }

  getStatsList(): Promise<StatDescription[]> {
    return new Promise<StatDescription[]>((resolve) => {
      this._http.get<ApiReturn>('/api/stats/description').subscribe((data) => {
        const descriptions = data.data as StatDescription[];
        resolve(descriptions);
      });
    });
  }
}

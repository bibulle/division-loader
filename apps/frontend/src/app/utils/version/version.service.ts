import { Injectable } from '@angular/core';
import { Version } from '@division-loader/apis';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor() {
    this.versionChangedSubject = new BehaviorSubject<boolean>(false);
  }

  frontendVersion = new Version().version;
  backendVersion = new Version().version;

  private versionChangedSubject: BehaviorSubject<boolean>;

  setBackendVersion(version: string) {
    // console.log(version);
    this.backendVersion = version;
    // console.log(`${this.frontendVersion} ${this.backendVersion} ${this.frontendVersion !== this.backendVersion}`);
    this.versionChangedSubject.next(this.frontendVersion !== this.backendVersion);
  }

  /**
   * Get the observable on version changes
   * @returns {Observable<boolean>}
   */
  versionChangedObservable(): Observable<boolean> {
    return this.versionChangedSubject.pipe(distinctUntilChanged());
  }
}

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Version } from '@division-loader/apis';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NavBarService } from './nav-bar.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'division-loader-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  links: { path: string; label: string; icon: string; iconType: string; selected: boolean }[] = [];

  version = new Version().version;
  updateNeeded = false;
  private _currentVersionChangedSubscription?: Subscription;

  loadingTimer = -1;
  private _currentLoadingStateSubscription?: Subscription;

  constructor(
    private _router: Router,
    // private _userService: UserService,
    // private _versionService: VersionService,
    // private _notificationService: NotificationService,
    private _navBarService: NavBarService
  ) {
    this._router.events.subscribe((data) => {
      // console.log(data.constructor.name);
      if (data instanceof NavigationEnd) {
        this.links.forEach((link) => {
          link.selected = '/' + link.path === data.urlAfterRedirects;
        });
      }
    });
  }

  ngOnInit() {
    // this._currentVersionChangedSubscription = this._versionService
    //   .versionChangedObservable()
    //   .subscribe((versionChanged) => {
    //     this.updateNeeded = versionChanged;
    //     if (this.updateNeeded) {
    //       this._notificationService.error('update-needed | translate');
    //     }
    //   });
    this._currentLoadingStateSubscription = this._navBarService.loadingObservable().subscribe((loadingState) => {
      // console.log(loadingState);
      this.loadingTimer = loadingState;
    });
    this.calculateMenus();
  }

  ngOnDestroy(): void {
    if (this._currentVersionChangedSubscription) {
      this._currentVersionChangedSubscription.unsubscribe();
    }
  }

  private calculateMenus() {
    const newLinks: { path: string; label: string; icon: string; iconType: string; selected: boolean }[] = [];

    this._router.config.forEach((obj) => {
      if (!obj.redirectTo && obj.data && obj.data['menu']) {
        newLinks.push({
          path: obj.path ? obj.path : '',
          label: obj.data['label'],
          icon: obj.data['icon'],
          iconType: obj.data['iconType'],
          selected: false,
        });
      }
    });

    this.links = newLinks;
  }

  getIconAttr(name: string): string {
    return `assets/img/symbol-defs.svg#${name}`;
  }

  update() {
    location.reload();
  }

  getAnimTooltip(loadingTimer: number): string {
    if (loadingTimer > 20) {
      return 'refresh.waiting30';
    } else if (loadingTimer > 10) {
      return 'refresh.waiting20';
    } else if (loadingTimer > 0) {
      return 'refresh.waiting10';
    } else if (loadingTimer === 0) {
      return 'refresh.loading';
    } else {
      return 'refresh.error';
    }
  }
}

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,

    ///AppRoutingModule,
    //NotificationModule,
    //UserModule,
    //RefreshModule
  ],
  declarations: [NavBarComponent],
  exports: [NavBarComponent],
})
export class NavBarModule {}

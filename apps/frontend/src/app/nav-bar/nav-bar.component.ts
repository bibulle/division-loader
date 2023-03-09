import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CategoryDescription, Version } from '@division-loader/apis';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../utils/notification/notification.service';
import { VersionService } from '../utils/version/version.service';
import { NavBarService } from './nav-bar.service';

interface Link {
  path: string | null;
  menu: MatMenuPanel | null;
  label: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'division-loader-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('graphMenu', { static: true })
  graphMenu: MatMenu | null = null;

  links: Link[] = [];

  version = new Version().version;
  updateNeeded = false;
  private _currentVersionChangedSubscription?: Subscription;

  statDescriptions: CategoryDescription[] = [];
  showCat: { [cat: string]: boolean } = {};

  loadingTimer = -1;
  private _currentLoadingStateSubscription?: Subscription;

  constructor(private _router: Router, private _notificationService: NotificationService, private _navBarService: NavBarService, private _versionService: VersionService) {
    this._router.events.subscribe((data) => {
      // console.log(data.constructor.name);
      if (data instanceof NavigationEnd) {
        this.links.forEach((link) => {
          link.selected = '/' + link.path === data.urlAfterRedirects || (!link.path && data.urlAfterRedirects.startsWith('/stats/'));
          // console.log(`${link.path} <-> ${data.urlAfterRedirects} -> ${link.selected}`);
        });
      }
    });
  }

  ngOnInit() {
    this._currentVersionChangedSubscription = this._versionService.versionChangedObservable().subscribe((versionChanged) => {
      // console.log(`version change : ${versionChanged}`);
      this.updateNeeded = versionChanged;
      if (this.updateNeeded) {
        this._notificationService.error('update-needed | translate');
      }
    });
    this._currentLoadingStateSubscription = this._navBarService.loadingObservable().subscribe((loadingState) => {
      // console.log(loadingState);
      this.loadingTimer = loadingState;
    });
    this.calculateMenus();

    this._navBarService.getStatsList().then((v) => {
      this.statDescriptions = v;
    });
  }

  ngOnDestroy(): void {
    if (this._currentVersionChangedSubscription) {
      this._currentVersionChangedSubscription.unsubscribe();
    }
    if (this._currentLoadingStateSubscription) {
      this._currentLoadingStateSubscription.unsubscribe();
    }
  }

  private calculateMenus() {
    const newLinks: Link[] = [];

    this._router.config.forEach((obj) => {
      if (!obj.redirectTo && obj.data && obj.data['menu']) {
        newLinks.push({
          path: obj.path ? obj.path : '',
          menu: null,
          label: obj.data['label'],
          icon: obj.data['icon'],
          selected: false,
        });
      }
    });
    // add the graph button
    newLinks.push({
      path: null,
      menu: this.graphMenu,
      label: 'graph-label',
      icon: 'graph',
      selected: false,
    });

    this.links = newLinks;
  }

  toggleCategory(event: MouseEvent, category: string) {
    this.showCat[category] = !this.showCat[category];
    event.stopPropagation();
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

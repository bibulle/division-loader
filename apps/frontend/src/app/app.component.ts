import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'division-loader-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(    private _translate: TranslateService,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
) {
  this._translate.setDefaultLang('en');

  [
    'flag_fr',
    'flag_us'
  ].forEach((name) => {
    this._matIconRegistry.addSvgIcon(
      name,
      this._domSanitizer.bypassSecurityTrustResourceUrl(`/assets/images/${name}.svg`)
    );
  });

}
}

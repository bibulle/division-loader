import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { VersionService } from './version.service';
import { ApiReturn } from '@division-loader/apis';

@Injectable()
export class VersionInterceptor implements HttpInterceptor {
  constructor(private _versionService: VersionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('VersionInterceptor intercept');

    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          const data = event.body as ApiReturn;
          if (data && data.version && data.version.version) {
            // console.log(data['version']);
            this._versionService.setBackendVersion(data.version.version);
            // this._versionService.checkVersion();
          }
        }
      })
    );
  }
}

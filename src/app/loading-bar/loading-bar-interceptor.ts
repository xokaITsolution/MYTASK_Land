
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingBarService } from './loading-bar.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingBarInterceptor implements HttpInterceptor {
  constructor(private loadingBarService: LoadingBarService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingBarService.start();

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingBarService.complete();
      })
    );
  }
}
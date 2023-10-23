import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  public loadingBarSubject = new Subject<boolean>();
  public requestCount = 0;

  start() {
    if (this.requestCount === 0) {
      this.loadingBarSubject.next(true);
    }
    this.requestCount++;
  }

  complete() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingBarSubject.next(false);
    }
  }

  getLoadingBarStatus() {
    return this.loadingBarSubject.asObservable();
  }
}
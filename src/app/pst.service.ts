import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  constructor(private appRef: ApplicationRef) {
    this.appRef.isStable
      .pipe(first((isStable) => isStable)).subscribe(() => {

      })
  }
}

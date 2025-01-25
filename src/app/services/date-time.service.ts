import { Injectable, OnDestroy } from '@angular/core';
import {
  interval, map, startWith,
  switchMap, Observable, shareReplay,
  BehaviorSubject, Subject } from 'rxjs';


import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService implements OnDestroy {
  readonly #apiUrl = 'https://worldtimeapi.org/api/timezone/Etc/UTC';
  private currentDateTime$ = new BehaviorSubject<Date>(new Date());
  private destroy$ = new Subject<void>();

  dateTime$: Observable<Date> = this.currentDateTime$.asObservable();

  constructor(private http: HttpClient) {
    this.syncWithServerTime();
  }


  private syncWithServerTime() {
    interval(60000) // 1 minute refresh rate
      .pipe(
        startWith(0),
        switchMap( () => this.fetchServerTime() ),
        shareReplay(1)
      )
      .subscribe({
        next: (serverTime) => {
          this.currentDateTime$.next(serverTime)
        },
        error: (err) => console.error('Failed to fetch server time', err),
      });
    interval(1000).subscribe(() => {
      const currentTime = this.currentDateTime$.value;
      this.currentDateTime$.next(new Date(currentTime.getTime() + 1000));
    });
  }

  private fetchServerTime(): Observable<Date> {
    return this.http.get<{ datetime: string }>(this.#apiUrl).pipe(
      map((response) => new Date(response.datetime))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

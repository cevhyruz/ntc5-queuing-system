import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, switchMap, timer } from 'rxjs';
import { QueueInterface } from '../queue.interface';

import { exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  constructor(private http: HttpClient) { }
  pollForChanges(): Observable<QueueInterface[]> {
    return this.http.get<QueueInterface[]>('http://192.168.1.105:3000/api/windows').pipe(
      catchError((error) => {
        return of([]); // fallback
      })
    );
  }
}

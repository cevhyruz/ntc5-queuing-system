import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, switchMap, timer } from 'rxjs';
import { QueueInterface } from './queue.interface';

import { exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  private readonly apiUrl = 'http://localhost:3000/api/queue';

  constructor(private http: HttpClient) { }

pollForChanges(): Observable<QueueInterface[]> {
  return this.http.get<QueueInterface[]>('http://localhost:3000/api/queue').pipe(
    catchError((error) => {
      // console.error('Error fetching queue data:', error);
      // Optionally, you can return a fallback value or rethrow the error
      return of([]); // Return an empty array as a fallback
      // Alternatively: throwError(() => new Error('Polling failed'));
    })
  );
}
}

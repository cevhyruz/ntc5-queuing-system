import { HttpClient } from '@angular/common/http';
import { OnInit, inject, Injectable, NgZone, ApplicationRef } from '@angular/core';
import { shareReplay, map, Subject, interval, Observable, switchMap, timer } from 'rxjs';
import { QueueInterface } from './../interfaces/queue.interface';

import { exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollingService {

  private readonly http = inject(HttpClient);

  // polls API server for changes
  pollForChanges(): Observable<QueueInterface[]> {
    return this.http.get<QueueInterface[]>('http://192.168.100.38:3000/api/windows').pipe(
      catchError((error) => {
        return of([]);
      })
    );
  }

  getQueueList(queueLimit: number): Observable<QueueInterface[]> {
    return this.pollForChanges().pipe(
      map((data: QueueInterface[]) => {
        const sortedData = this.sortData(data, 'id', 'asc');
        return this.fillRestWithNulls(sortedData, queueLimit);
      })
    )
  }

  // fill table remaining empty row with nulls
  private fillRestWithNulls(data: QueueInterface[], queueLimit: number): QueueInterface[] {
    while (data.length < queueLimit) {
      data.push({ id: null, referenceno: null, currentactiontaken: null });
    }
    return data.slice(0, queueLimit);
  }

  // sort by order (asc/desc) and type (id/referenceno/currentactiontaken)
  private sortData(data: any[], key: string, order: 'asc' | 'desc'): any[] {
    return data.sort((a, b) => {
      const valueA = a[key] ?? 0;
      const valueB = b[key] ?? 0;
      if (order === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

}

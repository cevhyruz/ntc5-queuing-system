import { Injectable, inject } from '@angular/core';
import { QueueInterface } from './../interfaces/queue.interface';
import { debounceTime, EMPTY, finalize, first, interval, last, map, Observable, of, Subject, switchMap, takeUntil, takeWhile, tap, timer } from 'rxjs';

interface QueueSettings {
  idleTime: number;
  timeToFullScreen: number;
  queueLimit: number;
}

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  private remainingTime: number = 0;

  // public toggleAds(queueList: QueueInterface[]): Observable<string> {
  //   // if (this.hasItems(queueList))
  // }

  private hasItems(queueList: QueueInterface[]): boolean {
    return queueList.some(item =>
      item.id !== null ||
      item.referenceno !== null ||
      item.currentactiontaken !== null
    );
  }



}

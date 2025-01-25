import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CountdownDialogComponent } from '@quems/components';
import { QueueInterface } from '@quems/interfaces';
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
  private readonly dialog = inject(MatDialog);
  private remainingTime: number = 0;

  public toggleAdsFullscreen(queueList: QueueInterface[], settings: QueueSettings): Observable<string> {
    this.closeExistingDialog();

    if (this.checkValidData(queueList)) {
      return of('vid-min');
    }

    const timeToFullscreen = settings.timeToFullScreen;
    const idleTime$ = timer(settings.idleTime);

    let wasClosedManually = false;

    const countdown$ = idleTime$.pipe(
      switchMap(() => {
        const dialogRef = this.dialog.open(CountdownDialogComponent, {
          disableClose: true,
          data: {
            countdown: timeToFullscreen / 1000,
            title: 'No activity detected',
            closeBtn: 'Stay in the current view',
            bodyTemplate: `
             Video will switch to fullscreen view
             in <code style="font-size: 17px;">
             <strong>{{ countdown }}</strong>
             </code>
             seconds
            `,
          }
        });

        const dialogClosed$ = new Subject<void>();

        dialogRef.afterClosed().subscribe(() => {
          wasClosedManually = true;
          dialogClosed$.next();
        });

        return interval(1000).pipe(
          takeUntil(dialogClosed$), // Stop when the dialog is closed
          map(secondsElapsed => {
            const remainingSeconds = (timeToFullscreen / 1000) - secondsElapsed;
            console.log(remainingSeconds);

            if (dialogRef.componentInstance) {
              dialogRef.componentInstance.updateDialogData(
                'countdown',
                remainingSeconds
              );
            }

            console.log('countdown: ', remainingSeconds);

            if (remainingSeconds === 0) {
              dialogRef.close();
            }

            return remainingSeconds;
          }),
          // Stop when countdown reaches 0
          takeWhile(remainingSeconds => remainingSeconds > 0)
        );
      }),
      last(), // Wait until the countdown completes
      switchMap(() => {
        if (!wasClosedManually) {
          this.updateCountdown(0);
          return of('vid-max');
        }
        // Stop the observable if the dialog was manually closed
        return EMPTY;
      })
    );
    return countdown$;
  }

  private checkValidData(queueList: QueueInterface[]): boolean {
    return queueList.some(item =>
      item.routingNo !== null ||
      item.transaction !== null ||
      item.id !== null
    );
  }

  private closeExistingDialog(): void {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs.length > 0) {
      return openDialogs.forEach(dialog => dialog.close());
    }
  }

  private updateCountdown(remainingSeconds: number): void {
    if (remainingSeconds > 0) {
      this.remainingTime = remainingSeconds;
    } else {
      this.remainingTime = 0;
    }
  }

}


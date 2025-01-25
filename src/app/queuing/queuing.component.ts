import { ApplicationRef, Component, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, DatePipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { timer, switchMap, Subject, tap, first, interval, map, Observable, of } from 'rxjs';

import { PollingService } from './../services/polling.service';
import { CountdownDialogComponent  } from './../countdown-dialog/countdown-dialog.component';
import { FullscreenService } from './../services/fullscreen.service';
import { AdvertisementService } from '../services/advertisement.service';

import { QueueInterface } from './../interfaces/queue.interface';
import { AgencyInterface } from './../interfaces/agency.interface';

@Component({
  selector: 'app-queuing',
  standalone: true,
  imports: [ CommonModule, MatProgressSpinnerModule, MatTableModule, MatCardModule, DatePipe, AsyncPipe ],
  templateUrl: './queuing.component.html',
  styleUrl: './queuing.component.scss'
})
export class QueuingComponent implements OnInit, OnDestroy {
  readonly agency: AgencyInterface = {
    name: 'National Telecommunications Commision',
    tagline: 'Regional Office No. V',
    location: 'Government Center, Rawis, Legazpi City',
    message: `
      Please select which service you want and please wait
      when your number is called.  Please bear with us as
      we make it more convenient for you. Thank you!
    `,
    displayedColumns: [
      'window',
      'referenceno',
    ]
  }


  private readonly pollingService = inject(PollingService);
  private readonly zone = inject(NgZone);
  private readonly appRef = inject(ApplicationRef);
  private readonly fullscreenService = inject(FullscreenService);
  private readonly advertisementService = inject(AdvertisementService);

  pollingSubscription: any;
  dateTime$!: Observable<Date>;

  // template internals
  public queueList$: QueueInterface[] = [];
  public videoClass = 'vid-min';
  public selectedVideoUrl: string | null = null;

  constructor() {
    this.appRef.isStable.pipe(
      first(isStable => isStable)).subscribe(() => {
        this.dateTime$ = this._getDateTime();
      });
  }

  ngOnInit(): void {
    this.advertisementService.selectedVideo$.subscribe((videoUrl) => {
      this.selectedVideoUrl = videoUrl;
    });

    console.log('queuing init')

    this.zone.runOutsideAngular(() => {
      this.pollingSubscription = timer(0, 1000)
        .pipe(
          switchMap(() => this.pollingService.getQueueList(10)),
        )
        .subscribe((data) => {
          this.zone.run(() => {
            this.queueList$ = data;
            this.toggleAds(data)
          });
        });
    });
  }

  private _getDateTime(): Observable<Date> {
    return timer(0, 1000).pipe(
      map(()=> new Date())
    );
  }

  private toggleAds(queueList: QueueInterface[]): void {
    if (this.hasItems(queueList)) {
      this.videoClass = 'vid-min';
    }
    else {
      this.videoClass = 'vid-max';
    }
  }

  private hasItems(queueList: QueueInterface[]): boolean {
    return queueList.some(item =>
      // item.id !== null ||
      // item.referenceno !== null ||
      // item.currentactiontaken !== null
      item.referenceno !== null
    );
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }


}

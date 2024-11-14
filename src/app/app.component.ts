import {
  ApplicationRef,
  Component,
  Inject,
  NgZone,
  OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { QueueInterface } from './queue.interface';
import { first, interval, map, Observable } from 'rxjs';
import { PollingService } from './polling.service';
import { AsyncPipe, DatePipe } from '@angular/common';

interface AgencyInterface {
  name: string;
  tagline: string;
  location: string;
  message: string;
  displayedColumns: string[];
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatTableModule,
    MatCardModule,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  queueList$!: QueueInterface[];
  pollingSubscription: any;

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
      'referenceno',
      'currentactiontaken'
    ]
  }

  dateTime$!: Observable<Date>;
  private countdownInterval: any;  // Store the interval ID

  constructor(
    private pollingService: PollingService,
    private zone: NgZone,
    private appRef: ApplicationRef,
  ) {

    this.queueList$ = new Array(10).fill(null).map(() => ({
      id: null,
      referenceno: null,
      currentactiontaken: null
    }));

    this.appRef.isStable.pipe(
      first(isStable => isStable)).subscribe(() => {
        this._getDateTime();
    });

  }

  // Philippine standard time
  private _getDateTime(): void {
    this.dateTime$ = interval(1000).pipe(
      map(() => new Date())
    );
  }


  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this.zone.run(() => {
          this.pollChange()
          this.isEmpty()
        });
      }, 1000);
    });
  }

  isEmpty() {
    if (!this.queueList$ || this.queueList$.length === 0) {
      return false
    } else {
      return true
    }
  }


  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

pollChange() {
  this.pollingSubscription = this.pollingService.pollForChanges().subscribe({
    next: (data: QueueInterface[]) => {
      try {
        this.queueList$ = new Array(10).fill(null).map((_, index) =>
          data[index] || { id: null, routingno: null, currentactiontaken: null }
        );
      } catch (error) {
        console.error('Error processing received data:', error);
      }
    },
    error: (err) => {
      // console.error('Error during polling:', err);
      // Optionally, show an error message or take corrective action
    },
    complete: () => {
      console.log('Polling completed');
    },
  });
}

}

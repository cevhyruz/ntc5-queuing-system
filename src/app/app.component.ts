import {
  ApplicationRef,
  Component,
  inject,
  NgZone,
  OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import {
  AsyncPipe, DatePipe,
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';


import { Subject, tap, first, interval, map, Observable, of } from 'rxjs';

// Interfaces
import { QueueInterface } from './queue.interface';
import { AgencyInterface } from './interfaces/agency.interface';

// Services
import { PollingService } from './services/polling.service';
import { DateTimeService } from './services/date-time.service';


// Components
import { CountdownDialogComponent  } from './countdown-dialog/countdown-dialog.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatCardModule,
    DatePipe, AsyncPipe,
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
      'window',
      'referenceno',
    ]
  }


public window: string[] = [
// 'Pre-Assesment',
  'Legal Issue Verification',
  'Statement of Account',
  'Order of Payment',
  'Issuance of Official Receipt',
  'Processing',
  'Reviews Printed Licenses / Permit / Certificate',
  'For Approval / Disapproval',
//  'Releases Approved Licenses / Permit / Certificate',
  'Pending Assesment and Releasing',
];

  public videoClass = 'vid-min';

  public isVideoFullscreen = false;

  dateTime$!: Observable<Date>;
  private countdownInterval: any;  // Store the interval ID

  private readonly dialog = inject(MatDialog);

  constructor(
    private pollingService: PollingService,
    private zone: NgZone,
    private appRef: ApplicationRef,
  ) {

    // add null when there is no data available
    // this.queueList$ = new Array(10).fill(null).map(() => ({
    //   id: null,
    //   referenceno: null,
    //   currentactiontaken: null
    // }));

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
      // console.log('not empty, minimizing')
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

  private _createNulls(): any {
    return {
      id: null,
      routingno: null,
      currentactiontaken: null
    };
  }

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

  pollChange() {
    this.pollingSubscription = this.pollingService.pollForChanges().subscribe({
      next: (data: QueueInterface[]) => {
        try {
          const sortedData = this.sortData(data, 'id', 'asc');


        // if (data.length === 0) {
        //   this.openCountdownDialog();
        //
        //   const dialogRef = this.dialog.open(CountdownDialogComponent, {
        //     width: '400px',
        //     disableClose: false,
        //     data { countdown: 20 };
        //   })
        //
        //   // dialogRef.afterClosed().subscribe(() => {
        //   // })
        //
        //
        // }

          this.queueList$ = new Array(10).fill(null).map((_, index) =>
            sortedData[index] || this._createNulls()
          );

        } catch (error) {
          console.error('Error processing received data:', error);
        }
      },
      error: (err) => { },
    });
  }

  openCountdownDialog() {
    let wasClosedManually = false;

    const dialogRef = this.dialog.open(CountdownDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { countdown: 5 }, // Starting countdown value
    });

    const dialogClosed$ = new Subject<void>();

    dialogRef.afterClosed().subscribe(() => {
      wasClosedManually = true;
      dialogClosed$.next();
    });

    // countdown
  }

  toggleVideoFullscreen() {
    this.isVideoFullscreen = true; // This should bind to NgClass in your HTML
  }

}

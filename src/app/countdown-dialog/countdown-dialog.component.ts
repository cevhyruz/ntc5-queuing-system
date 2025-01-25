import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';


interface DialogDataInterface {
  bodyTemplate: string;
  title: string;
  closeBtn: string;
  [key: string]: any;
}

@Component({
  selector: 'app-countdown-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <div [innerHTML]="parsedBody"></div>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>
      {{ data.closeBtn }}
      </button>
    </div> `,
  styleUrls: ['./countdown-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ CommonModule, MatDialogModule, MatButtonModule ],
})
export class CountdownDialogComponent {
  public readonly data: DialogDataInterface = inject(MAT_DIALOG_DATA);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  public parsedBody: SafeHtml = '';

  constructor() {
    this.interpolateBodyTemplate();
  }

  private interpolateBodyTemplate() {
    const interpolatedBody =
      this.data.bodyTemplate.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
      if (key in this.data) {
        return this.data[key].toString();
      }
      return `{{${key}}}`;
    });
    this.parsedBody = this.sanitizer.bypassSecurityTrustHtml(interpolatedBody);
    this.cdr.markForCheck();
  }

  updateDialogData(context: string, data: any) {
    this.data[context] = data;
    this.interpolateBodyTemplate();
  }
}


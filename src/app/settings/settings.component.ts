import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdvertisementService } from '../services/advertisement.service';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatButtonModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit{
  settings = {
    siteTitle: '',
    siteDescription: '',
    colorScheme: 'all',
    showHeader: true,
    enableFooter: false,
  };

  // template internals
  videoPreviewUrl: string | null = null;


  constructor(private advertisementService: AdvertisementService ) {}

  ngOnInit(): void {
    this.advertisementService.selectedVideo$.subscribe((videoUrl) => {
      this.videoPreviewUrl = videoUrl;
    });
  }

  onVideoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.videoPreviewUrl = URL.createObjectURL(file);
      this.advertisementService.setSelectedVideo(this.videoPreviewUrl);
    }
  }

  onSubmit(): void {
    console.log('Settings saved:', this.settings);
    // Add further logic for saving settings
  }
}

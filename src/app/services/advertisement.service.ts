import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private defaultVideoUrl = './sample_video.mp4';
  private selectedVideoSource = new BehaviorSubject<string | null>(
    this.defaultVideoUrl
  );
  selectedVideo$ = this.selectedVideoSource.asObservable();

  constructor() {
    // Check if localStorage is available and get the saved video
    const initialVideo =
      typeof window !== 'undefined' && localStorage.getItem('selectedVideo')
        ? localStorage.getItem('selectedVideo')
        : this.defaultVideoUrl;

    this.selectedVideoSource.next(initialVideo);
  }

  setSelectedVideo(videoUrl: string): void {
    this.selectedVideoSource.next(videoUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedVideo', videoUrl);
    }
  }

  resetToDefault(): void {
    this.setSelectedVideo(this.defaultVideoUrl);
  }
}


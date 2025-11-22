import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap, tap, retry, catchError } from 'rxjs/operators';

interface TimeResponse {
  utc_datetime: string;
  unixtime: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeSyncService {
  private offset = 0;
  private _isSynced = new BehaviorSubject<boolean>(false);
  public isSynced$ = this._isSynced.asObservable();

  constructor(private http: HttpClient) {
    this.syncTime();
  }

  private syncTime() {
    // Use worldtimeapi.org or similar. 
    // Adding a timestamp to prevent caching.
    const url = 'https://worldtimeapi.org/api/timezone/Etc/UTC';
    
    this.http.get<TimeResponse>(url).pipe(
      retry(3), // Retry a few times if it fails
      tap(response => {
        const serverTime = new Date(response.utc_datetime).getTime();
        const localTime = Date.now();
        // Calculate offset: Server - Local
        // If server is ahead, offset is positive.
        // getNow() = Date.now() + offset
        this.offset = serverTime - localTime;
        this._isSynced.next(true);
        console.log('Time synced. Offset:', this.offset);
      }),
      catchError(err => {
        console.error('Failed to sync time', err);
        // Fallback to local time if sync fails, but keep synced false?
        // Or just assume local time is "correct enough" for offline but warn?
        // For now, we just log error.
        return [];
      })
    ).subscribe();
  }

  public getNow(): number {
    return Date.now() + this.offset;
  }

  public getOffset(): number {
    return this.offset;
  }
}

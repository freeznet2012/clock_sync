import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlStateService } from '../../core/services/url-state.service';
import { TimeSyncService } from '../../core/services/time-sync.service';
import { Subscription, interval } from 'rxjs';
import { QrShareComponent } from '../../shared/components/qr-share/qr-share.component';

@Component({
    selector: 'app-stopwatch',
    standalone: true,
    imports: [CommonModule, QrShareComponent],
    templateUrl: './stopwatch.component.html',
    styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit, OnDestroy {
    elapsedTime = 0;
    isRunning = false;
    startTime: number | undefined;

    private timerSub: Subscription | null = null;
    private stateSub: Subscription | null = null;

    constructor(
        public urlState: UrlStateService,
        private timeSync: TimeSyncService
    ) { }

    ngOnInit() {
        this.stateSub = this.urlState.getState().subscribe(state => {
            if (state.mode === 'stopwatch' && state.startTime) {
                this.startTime = state.startTime;
                this.isRunning = true;
                this.startTicker();
            } else {
                this.resetLocal();
            }
        });
    }

    ngOnDestroy() {
        this.stopTicker();
        if (this.stateSub) this.stateSub.unsubscribe();
    }

    start() {
        if (this.isRunning) return;
        // Set start time to NOW - elapsed (if we want to resume, but for now simple start)
        // Actually, if we pause, we need to handle that. 
        // But the requirement says "user can start any of these... see same state".
        // Simple stopwatch: Start time is fixed.
        // If we want pause/resume, we need to track accumulated time or pause time.
        // For MVP/Simple Sync: Just start time. If you pause, you reset or it keeps running?
        // Let's assume continuous running for now as "sync time" implies a timeline.
        // Or we can just update the start time to be "now - elapsed".

        const now = this.timeSync.getNow();
        this.startTime = now - this.elapsedTime;

        this.urlState.updateState({
            mode: 'stopwatch',
            startTime: this.startTime
        });
    }

    stop() {
        // To "stop" and sync, we might need a different state param like "pausedAt".
        // But for now, let's just clear the URL state (reset) or just stop locally?
        // If we stop locally, we break sync.
        // Let's implement "Reset" which clears everything.
        // "Stop" might just be a local view thing or we need to support it in URL.
        // User request: "see same state of stopwatch".
        // If I stop, others should see it stopped?
        // That would require "pausedAt" timestamp in URL.
        // Let's stick to Start/Reset for simplicity first, or add Pause if easy.
        // Let's just do Start and Reset.
        this.reset();
    }

    reset() {
        this.urlState.clearState();
    }

    private startTicker() {
        this.stopTicker();
        this.timerSub = interval(50).subscribe(() => {
            if (this.startTime) {
                const now = this.timeSync.getNow();
                this.elapsedTime = Math.max(0, now - this.startTime);
            }
        });
    }

    private stopTicker() {
        if (this.timerSub) {
            this.timerSub.unsubscribe();
            this.timerSub = null;
        }
    }

    private resetLocal() {
        this.stopTicker();
        this.elapsedTime = 0;
        this.isRunning = false;
        this.startTime = undefined;
    }

    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    }
}

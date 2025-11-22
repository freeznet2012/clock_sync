import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlStateService } from '../../core/services/url-state.service';
import { TimeSyncService } from '../../core/services/time-sync.service';
import { Subscription, interval } from 'rxjs';
import { QrShareComponent } from '../../shared/components/qr-share/qr-share.component';

@Component({
    selector: 'app-timer',
    standalone: true,
    imports: [CommonModule, FormsModule, QrShareComponent],
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
    remainingTime = 0;
    isRunning = false;
    startTime: number | undefined;
    duration: number | undefined;

    // Input fields
    inputMinutes = 5;
    inputSeconds = 0;

    private timerSub: Subscription | null = null;
    private stateSub: Subscription | null = null;
    private audio: HTMLAudioElement | null = null;

    constructor(
        public urlState: UrlStateService,
        private timeSync: TimeSyncService
    ) { }

    ngOnInit() {
        this.stateSub = this.urlState.getState().subscribe(state => {
            if (state.mode === 'timer' && state.startTime && state.duration) {
                this.startTime = state.startTime;
                this.duration = state.duration;
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
        if (this.audio) this.audio.pause();
    }

    start() {
        if (this.isRunning) return;

        const durationMs = (this.inputMinutes * 60 + this.inputSeconds) * 1000;
        if (durationMs <= 0) return;

        const now = this.timeSync.getNow();
        this.startTime = now;
        this.duration = durationMs;

        this.urlState.updateState({
            mode: 'timer',
            startTime: this.startTime,
            duration: this.duration
        });
    }

    reset() {
        this.urlState.clearState();
    }

    private startTicker() {
        this.stopTicker();
        this.timerSub = interval(100).subscribe(() => {
            if (this.startTime && this.duration) {
                const now = this.timeSync.getNow();
                const elapsed = now - this.startTime;
                this.remainingTime = Math.max(0, this.duration - elapsed);

                if (this.remainingTime === 0) {
                    this.playAlert();
                    this.stopTicker();
                }
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
        this.remainingTime = 0;
        this.isRunning = false;
        this.startTime = undefined;
        this.duration = undefined;
    }

    private playAlert() {
        // Create a basic tone using Web Audio API or use an audio file
        // For now, let's use a simple beep
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }

    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}`;
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlStateService } from '../../core/services/url-state.service';
import { TimeSyncService } from '../../core/services/time-sync.service';
import { Subscription, interval } from 'rxjs';
import { QrShareComponent } from '../../shared/components/qr-share/qr-share.component';

@Component({
    selector: 'app-alarm',
    standalone: true,
    imports: [CommonModule, FormsModule, QrShareComponent],
    templateUrl: './alarm.component.html',
    styleUrls: ['./alarm.component.scss']
})
export class AlarmComponent implements OnInit, OnDestroy {
    isRunning = false;
    targetTime: number | undefined;
    timeUntilAlarm = 0;
    alarmTriggered = false;

    // Input fields
    inputHours = new Date().getHours();
    inputMinutes = new Date().getMinutes() + 1;

    private timerSub: Subscription | null = null;
    private stateSub: Subscription | null = null;
    private alarmInterval: any = null;

    constructor(
        public urlState: UrlStateService,
        private timeSync: TimeSyncService
    ) { }

    ngOnInit() {
        this.stateSub = this.urlState.getState().subscribe(state => {
            if (state.mode === 'alarm' && state.targetTime) {
                this.targetTime = state.targetTime;
                this.isRunning = true;
                this.alarmTriggered = false;
                this.startTicker();
            } else {
                this.resetLocal();
            }
        });
    }

    ngOnDestroy() {
        this.stopTicker();
        if (this.stateSub) this.stateSub.unsubscribe();
        if (this.alarmInterval) clearInterval(this.alarmInterval);
    }

    start() {
        if (this.isRunning) return;

        // Create target time from inputs
        const now = new Date(this.timeSync.getNow());
        const target = new Date(now);
        target.setHours(this.inputHours, this.inputMinutes, 0, 0);

        // If the time is in the past today, set it for tomorrow
        if (target.getTime() <= now.getTime()) {
            target.setDate(target.getDate() + 1);
        }

        this.targetTime = target.getTime();

        this.urlState.updateState({
            mode: 'alarm',
            targetTime: this.targetTime
        });
    }

    reset() {
        this.stopAlarm();
        this.urlState.clearState();
    }

    private startTicker() {
        this.stopTicker();
        this.timerSub = interval(500).subscribe(() => {
            if (this.targetTime) {
                const now = this.timeSync.getNow();
                this.timeUntilAlarm = Math.max(0, this.targetTime - now);

                if (this.timeUntilAlarm === 0 && !this.alarmTriggered) {
                    this.triggerAlarm();
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
        this.stopAlarm();
        this.timeUntilAlarm = 0;
        this.isRunning = false;
        this.targetTime = undefined;
        this.alarmTriggered = false;
    }

    private triggerAlarm() {
        this.alarmTriggered = true;
        this.playAlarmSound();
    }

    private playAlarmSound() {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        let beepCount = 0;

        const playBeep = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 880;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        };

        // Play repeating beeps
        this.alarmInterval = setInterval(() => {
            playBeep();
            beepCount++;
            if (beepCount >= 10) {
                this.stopAlarm();
            }
        }, 1000);
    }

    private stopAlarm() {
        if (this.alarmInterval) {
            clearInterval(this.alarmInterval);
            this.alarmInterval = null;
        }
    }

    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    getAlarmTime(): string {
        if (!this.targetTime) return '';
        const date = new Date(this.targetTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

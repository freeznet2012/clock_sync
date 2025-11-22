import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlStateService, AppMode } from '../../core/services/url-state.service';
import { Subscription } from 'rxjs';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';
import { TimerComponent } from '../timer/timer.component';
import { AlarmComponent } from '../alarm/alarm.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, StopwatchComponent, TimerComponent, AlarmComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    activeTab: AppMode = 'stopwatch';
    private stateSub: Subscription | null = null;

    constructor(private urlState: UrlStateService) { }

    ngOnInit() {
        // Read initial mode from URL
        this.stateSub = this.urlState.getState().subscribe(state => {
            if (state.mode && state.mode !== 'home') {
                this.activeTab = state.mode;
            }
        });
    }

    ngOnDestroy() {
        if (this.stateSub) this.stateSub.unsubscribe();
    }

    selectTab(tab: AppMode) {
        if (tab === 'home') return;
        this.activeTab = tab;
        // Clear state when switching tabs
        this.urlState.clearState();
    }
}

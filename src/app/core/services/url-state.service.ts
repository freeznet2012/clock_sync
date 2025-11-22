import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type AppMode = 'home' | 'stopwatch' | 'timer' | 'alarm';

export interface AppState {
    mode: AppMode;
    startTime?: number; // For stopwatch/timer
    duration?: number; // For timer
    targetTime?: number; // For alarm
    isRunning?: boolean; // For stopwatch (maybe not needed if we just use start time)
}

@Injectable({
    providedIn: 'root'
})
export class UrlStateService {

    constructor(private route: ActivatedRoute, private router: Router) { }

    getState(): Observable<AppState> {
        return this.route.queryParams.pipe(
            map(params => {
                const mode = (params['mode'] as AppMode) || 'home';
                const state: AppState = { mode };

                if (params['start']) {
                    state.startTime = parseInt(params['start'], 10);
                }
                if (params['duration']) {
                    state.duration = parseInt(params['duration'], 10);
                }
                if (params['target']) {
                    state.targetTime = parseInt(params['target'], 10);
                }

                return state;
            })
        );
    }

    updateState(state: Partial<AppState>) {
        const queryParams: any = {
            mode: state.mode
        };

        if (state.startTime !== undefined) queryParams.start = state.startTime;
        if (state.duration !== undefined) queryParams.duration = state.duration;
        if (state.targetTime !== undefined) queryParams.target = state.targetTime;

        this.router.navigate([], {
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true // Update URL without adding to history stack for every tick? No, only on state change.
        });
    }

    clearState() {
        this.router.navigate([], {
            queryParams: {},
            replaceUrl: true
        });
    }

    getLink(): string {
        return window.location.href;
    }
}

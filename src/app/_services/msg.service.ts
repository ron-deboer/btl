import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

export enum EventType {
    Refresh,
}

export interface IEvent {
    eventType: EventType;
    data?: any;
}

@Injectable({
    providedIn: 'root',
})
export class MsgService {
    private eventBus: Subject<IEvent>;

    constructor() {
        this.eventBus = new Subject<IEvent>();
    }

    broadcast(eventType: EventType, data?: any): void {
        this.eventBus.next({ eventType, data });
    }

    on<T>(eventType: EventType): Observable<T> {
        return this.eventBus.asObservable().pipe(
            filter((event) => event.eventType === eventType),
            map((event) => event.data as T)
        );
    }
}

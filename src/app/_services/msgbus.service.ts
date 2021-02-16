import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
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
export class MsgBusService {
    private eventBus: Subject<IEvent>;

    constructor() {
        this.eventBus = new Subject<IEvent>();
    }

    broadcast(eventType: EventType, data?: any): void {
        this.eventBus.next({ eventType, data });
    }

    listenFor<T>(eventType: EventType): Promise<T> {
        let OBS = this.eventBus.asObservable().pipe(
            filter((event) => event.eventType === eventType),
            map((event) => event.data as T)
        );
        let resolver = (subsription: Subscription, resolve: Function, result: T) => {
            resolve(result);
            subsription.unsubscribe();
        };
        let rejecter = (subsription: Subscription, reject: Function, error: any) => {
            reject(error);
            subsription.unsubscribe();
        };
        return new Promise((resolve, reject) => {
            let subscription = OBS.subscribe(
                (result) => {
                    resolver(subscription, resolve, result);
                },
                (error) => {
                    rejecter(subscription, reject, error);
                }
            );
        });
    }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IUser } from '../_interfaces/user';
import { EventType, MsgBusService } from '../_services/msgbus.service';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    user: IUser = null;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private msgBusService: MsgBusService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getSessionData();
        this.msgBusService.listenFor(EventType.Refresh).then((data) => {
            this.getSessionData();
            this.cdRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getSessionData(): void {
        this.user = this.authService.getUser();
    }

    logout(): void {
        this.user = null;
        this.authService.logout();
    }
}

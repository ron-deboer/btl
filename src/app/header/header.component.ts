import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { IUser } from '../_interfaces/user';
import { EventType, MsgService } from '../_services/msg.service';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    user: IUser = null;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private msgService: MsgService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getSessionData();
        this.subscriptions.add(
            this.msgService.on(EventType.Refresh).subscribe((data) => {
                this.getSessionData();
                this.cdRef.detectChanges();
            })
        );
    }

    getSessionData(): void {
        this.user = this.authService.getUser();
    }

    logout(): void {
        this.user = null;
        this.authService.logout();
    }
}

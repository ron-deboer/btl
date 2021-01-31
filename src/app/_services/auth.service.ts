import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { IUser } from '../_interfaces/user';
import { EventType, MsgService } from './msg.service';

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user: IUser = null;
    authenticated = false;
    redirectUrl: string = '/';

    constructor(private router: Router, private http: HttpClient, private msgService: MsgService) {}

    setRedirectUrl(url: string): void {
        if (url !== '/login') {
            this.redirectUrl = url;
        }
    }

    login(username: string, password: string): Promise<boolean> {
        this.authenticated = false;
        let enc = CryptoJS.Rabbit.encrypt(`${username}.${password}`, '12:30pmIsTime4Lunch!');
        const dat = enc.toString();
        return this.http
            .post<any>(`${environment.apiUrl}/users/authenticate`, { dat })
            .toPromise()
            .then(
                (user) => {
                    this.user = user;
                    this.msgService.broadcast(EventType.Refresh, {});
                    sessionStorage.setItem('user', JSON.stringify(user));
                    this.authenticated = true;
                    this.router.navigate([this.redirectUrl]);
                    return true;
                },
                (err) => {
                    this.logout();
                    return false;
                }
            );
    }

    logout() {
        sessionStorage.removeItem('user');
        this.user = null;
        this.authenticated = false;
        this.redirectUrl = '/';
        this.router.navigate([this.redirectUrl]);
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    getUser(): IUser {
        return this.user;
    }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    public canActivate() {
        if (!this.authService.isAuthenticated()) {
            this.authService.setRedirectUrl(this.router.url);
            return this.router.parseUrl('/login');
        }
        return true;
    }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '../_services/auth.service';
import { FakeDataLoader } from '../_helpers/fake-data';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    error = ' ';
    public loginForm: FormGroup = new FormGroup({
        username: new FormControl('user'),
        password: new FormControl('user'),
    });

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        FakeDataLoader();
    }

    onSubmit(): void {
        this.error = '';
        if (this.loginForm.invalid) {
            this.error = 'invalid form data';
            return;
        }
        this.authService
            .login(this.loginForm.get('username').value, this.loginForm.get('password').value)
            .then((resp) => {
                if (!resp) {
                    this.error = 'invalid credentials';
                }
            });
    }

    clearError(): void {
        this.error = '';
    }
}

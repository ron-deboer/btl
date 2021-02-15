import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '../_services/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    error = ' ';
    public loginForm: FormGroup = new FormGroup({
        username: new FormControl('admin'),
        password: new FormControl('admin'),
    });

    constructor(private authService: AuthService, private toastr: ToastrService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.toastr.info('user-1/user-1 or admin/admin', 'Login', {
                timeOut: 6000,
            });
        }, 0);
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

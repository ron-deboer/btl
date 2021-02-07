import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../_interfaces/user';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    users: BehaviorSubject<[]> = new BehaviorSubject([]);
    users$: Observable<[]> = this.users.asObservable();

    model = {
        id: 1,
        username: 'deboerr',
        name: 'Ron deBoer',
        email: 'deboerr@mail.com',
        roles: `admin,user`,
    };

    constructor() {}

    ngOnInit(): void {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => {
                this.users.next(json);
                console.table(this.users.value);
            });
    }

    onEditRow(idx: number): void {
        if (idx === -1) {
            this.model = {
                id: 0,
                name: '',
                username: '',
                email: '',
                roles: `admin,user`,
            };
            return;
        }
        const dat = this.users.value[idx];
        this.model = {
            id: parseInt(dat['id'], 10),
            name: dat['name'],
            username: dat['username'],
            email: dat['email'],
            roles: `admin,user`,
        };
    }
}

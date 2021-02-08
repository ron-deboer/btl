import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { IUser } from '../_interfaces/user';
import { isNumeric } from '../_helpers/utils';

import { UserService } from '../_services/user.service';

const USER_CRUD_SPEC = [
    { key: 'id', default: 0 },
    { key: 'username', default: '' },
    { key: 'name', default: '' },
    { key: 'email', default: '' },
    { key: 'role', default: 'user' },
];

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    users: BehaviorSubject<IUser[]> = new BehaviorSubject([]);
    users$: Observable<IUser[]> = this.users.asObservable();

    model: IUser = null;

    loading = true;

    constructor(private userService: UserService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.fetchAllUsers().then((resp) => {
            this.cdRef.detectChanges();
        });
    }

    fetchAllUsers(): Promise<IUser[]> {
        return this.userService
            .getAll()
            .toPromise()
            .then((resp: IUser[]) => {
                this.users.next(resp);
                this.loading = false;
                console.log(this.users.value);
            });
    }

    onEditRow(idx: number): void {
        this.model = null;
        if (idx === -1) {
            USER_CRUD_SPEC.forEach((field) => {
                this.model[field.key] = field.default;
            });
            return;
        }
        const dat = this.users.value[idx];
        USER_CRUD_SPEC.forEach((field) => {
            this.model[field.key] = isNumeric(field.default) ? parseInt(dat[field.key], 10) : dat[field.key];
        });
    }
}

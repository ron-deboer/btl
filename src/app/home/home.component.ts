import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IUser } from '../_interfaces/user';
import { isNumeric } from '../_helpers/utils';
import { UserService } from '../_services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    loading = true;
    users: IUser[] = [];
    model: IUser = null;

    USER_CRUD_SPEC = {
        id: { type: 'text', default: 0 },
        username: { type: 'text', default: '' },
        name: { type: 'text', default: '' },
        email: { type: 'text', default: '' },
        role: { type: 'select', source: ['admin', 'user'], default: 'user' },
    };

    constructor(private userService: UserService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.fetchAllUsers().then((resp) => {
            this.users = resp;
            console.log('1111', resp[0]);
            this.loading = false;
        });
    }

    fetchAllUsers(): Promise<any> {
        return this.userService.getAll().toPromise();
    }

    onSubmit() {}

    onEditRow(idx: number): void {
        this.model = {} as IUser;
        if (idx === -1) {
            Object.keys(this.USER_CRUD_SPEC).forEach((field) => {
                this.model[field] = this.USER_CRUD_SPEC[field].default;
            });
            return;
        }
        const dat = this.users.find((x) => x.id === idx);
        Object.keys(this.USER_CRUD_SPEC).forEach((field) => {
            this.model[field] = isNumeric(this.USER_CRUD_SPEC[field].default)
                ? parseInt(dat[field], 10)
                : dat[field];
        });
    }
}

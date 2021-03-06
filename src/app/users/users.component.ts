import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IUser } from '../_interfaces/user';
import { isNumeric } from '../_helpers/utils';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
    loading = true;
    users: IUser[] = [];
    model: IUser = null;
    USER_CRUD_SPEC = {
        id: { type: 'text', default: 0 },
        username: { type: 'text', default: '' },
        name: { type: 'text', default: '' },
        email: { type: 'text', default: '' },
        role: { type: 'select', source: ['admin', 'user'], default: 'user' },
        password: { type: 'text', default: '' },
        token: { type: 'text', default: '' },
        boardcode: { type: 'text', default: '' },
    };

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.fetchAllUsers().then((resp) => {
            this.users = resp;
            this.loading = false;
        });
    }

    fetchAllUsers(): Promise<any> {
        return this.userService.getAll().toPromise();
    }

    timePipe() {
        return { transform: (value) => this.datePipe.transform(value, 'hh:mm') };
    }

    onSubmit(closeButton) {
        if (this.model.id > 0) {
            const idx = this.users.findIndex((x) => x.id === this.model.id);
            this.users[idx] = Object.assign({}, this.model);
            this.userService.updateUser(this.model).toPromise();
        } else {
            this.model.id = this.users.sort((a, b) => (a.id < b.id ? 1 : -1))[0].id + 2;
            this.model.password = this.model.username;
            this.userService.insertUser(this.model).toPromise();
        }
        this.users = Object.assign([], this.users);

        this.toastr.success('Updated Ok!', 'User', {
            timeOut: 3000,
        });
        closeButton.click();
    }

    onEditRow(idx: number): void {
        this.model = {} as IUser;
        if (idx === -1) {
            Object.keys(this.USER_CRUD_SPEC).forEach((field) => {
                this.model[field] = this.USER_CRUD_SPEC[field].default;
            });
            this.model.id = 0;
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

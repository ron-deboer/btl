import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IUser } from '../_interfaces/user';
import { isNumeric } from '../_helpers/utils';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    // encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterViewInit {
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
            // console.log('>>>', this.users.length);
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
        console.log(this.model);
        const idx = this.users.findIndex((x) => x.id === this.model.id);
        let dat = this.users[idx];
        Object.keys(this.model).forEach((fld) => {
            dat[fld] = this.model[fld];
        });
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
            return;
        }
        const dat = this.users.find((x) => x.id === idx);
        Object.keys(this.USER_CRUD_SPEC).forEach((field) => {
            this.model[field] = isNumeric(this.USER_CRUD_SPEC[field].default) ? parseInt(dat[field], 10) : dat[field];
        });
    }
}

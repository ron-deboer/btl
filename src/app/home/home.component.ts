import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IUser } from '../_interfaces/user';
import { isNumeric } from '../_helpers/utils';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
    loading = true;
    users: IUser[] = [];
    model: IUser = null;

    constructor(private toastr: ToastrService, private datePipe: DatePipe) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}
}

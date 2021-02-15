import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { isNumeric } from '../_helpers/utils';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../_interfaces/item';
import { ItemService } from '../_services/item.service';
import { CodeService } from '../_services/code.service';
import { UserService } from '../_services/user.service';
import { ECodeType, ICode } from '../_interfaces/code';
import { IUser } from '../_interfaces/user';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit, AfterViewInit {
    @ViewChild('itemform') itemform: ElementRef;

    loading = true;
    user: IUser;
    items: IItem[] = [];
    codes: ICode[] = [];
    users: IUser[] = [];

    model: IItem = null;
    ITEM_CRUD_SPEC = {
        id: { type: 'text', default: 0, required: true },
        title: { type: 'text', default: '', required: true },
        boardcode: { type: 'select', source: [], default: '', required: true },
        projectcode: { type: 'select', source: [], default: '', required: true },
        prioritycode: { type: 'select', source: [], default: '', required: true },
        sizecode: { type: 'select', source: [], default: '', required: true },
        statuscode: { type: 'select', source: [], default: '', required: true },
        assignedtouser: { type: 'text', default: '', required: false },
        description: { type: 'text', default: '', required: true },
        comments: { type: 'text', default: '', required: false },
    };

    constructor(
        private itemService: ItemService,
        private codeService: CodeService,
        private userService: UserService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = JSON.parse(sessionStorage.getItem('user'));
    }

    ngAfterViewInit(): void {
        let prArray = [] as any;
        prArray.push(this.fetchAllItems());
        prArray.push(this.fetchAllCodes());
        prArray.push(this.fetchAllUsers());

        Promise.all(prArray).then((values) => {
            this.loading = false;
        });
    }

    fetchAllItems(): Promise<any> {
        return this.itemService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.items = resp.sort((a, b) => (a.boardcode > b.boardcode ? 1 : -1));
                return true;
            });
    }

    fetchAllCodes(): Promise<any> {
        return this.codeService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.codes = resp;
                this.loadSelectCodes('boardcode', ECodeType.Board);
                this.loadSelectCodes('projectcode', ECodeType.Project);
                this.loadSelectCodes('prioritycode', ECodeType.Priority);
                this.loadSelectCodes('sizecode', ECodeType.Size);
                this.loadSelectCodes('statuscode', ECodeType.Status);
                return true;
            });
    }

    fetchAllUsers(): Promise<any> {
        return this.userService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.users = resp.sort((a, b) => (a.username > b.username ? 1 : -1));
                this.loadSelectUsers('assignedtouser');
                return true;
            });
    }

    loadSelectCodes(key, codeType) {
        this.ITEM_CRUD_SPEC[key].source = this.codes.filter((x) => x.codetype === codeType).map((x) => x.code);
    }

    loadSelectUsers(key) {
        this.ITEM_CRUD_SPEC[key].source = this.users.map((x) => x.username);
    }

    timePipe() {
        return { transform: (value) => this.datePipe.transform(value, 'hh:mm') };
    }

    onEditRow(idx: number): void {
        this.initModel();
        if (idx === -1) {
            Object.keys(this.ITEM_CRUD_SPEC).forEach((field) => {
                this.model[field] = this.ITEM_CRUD_SPEC[field].default;
            });
            return;
        }
        const dat = this.items.find((x) => x.id === idx);
        Object.keys(this.ITEM_CRUD_SPEC).forEach((field) => {
            const prevValue = this.model[field];
            this.model[field] = isNumeric(this.ITEM_CRUD_SPEC[field].default) ? parseInt(dat[field], 10) : dat[field];
            // timestamps
            if (field === 'assignedtouser') {
                if (prevValue === '' && this.model[field] !== '') {
                    this.model.assignedtimestamp = new Date().toISOString();
                }
            }
            if (field === 'statuscode') {
                if (prevValue !== 'Closed' && (this.model[field] as string) === 'Closed') {
                    this.model.closedtimestamp = new Date().toISOString();
                    this.model.closedbyuser = this.user.username;
                }
            }
        });
    }

    onSubmit(closeButton) {
        let err = '';
        Object.keys(this.model).forEach((fld) => {
            if (fld !== 'id' && this.ITEM_CRUD_SPEC.hasOwnProperty(fld)) {
                if (this.checkIfInvalid(fld)) {
                    err = `${fld} is required`;
                }
            }
        });
        if (err !== '') {
            this.toastr.error(err, 'Item', {
                timeOut: 3000,
            });
            return false;
        }

        if (this.model.id > 0) {
            const idx = this.items.findIndex((x) => x.id === this.model.id);
            this.items[idx] = Object.assign({}, this.model);
            this.itemService.updateItem(this.model).toPromise();
        } else {
            this.model.id = this.items.sort((a, b) => (a.id < b.id ? 1 : -1))[0].id + 2;
            this.model.disporder = this.model.id + 10000;
            this.items.push(this.model);
            this.itemService.insertItem(this.model).toPromise();
        }
        this.items = Object.assign([], this.items);

        this.toastr.success('Updated Ok!', 'Item', {
            timeOut: 3000,
        });

        closeButton.click();
        return true;
    }

    initModel() {
        this.model = <IItem>{
            id: 0,
            title: '',
            disporder: 0,
            boardcode: '' as ECodeType.Board,
            projectcode: '' as ECodeType.Project,
            prioritycode: '' as ECodeType.Priority,
            sizecode: '' as ECodeType.Size,
            statuscode: '' as ECodeType.Status,
            createdbyuser: this.user.username,
            createdtimestamp: new Date().toISOString(),
            assignedtouser: '',
            assignedtimestamp: '',
            closedbyuser: '',
            closedtimestamp: '',
            description: '',
            comments: '',
        };
    }

    checkIfInvalid(fld) {
        if (this.ITEM_CRUD_SPEC[fld].required && this.model[fld] === '') {
            return true;
        }
        switch (fld) {
            case 'assignedtouser':
                return (this.model.statuscode as string) === 'Assigned' && this.model[fld] === '';
                break;
        }
    }
}

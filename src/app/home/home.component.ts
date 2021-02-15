import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    ViewChild,
} from '@angular/core';
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
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnChanges {
    loading = true;
    user: IUser;
    items: IItem[] = [];
    codes: ICode[] = [];
    users: IUser[] = [];
    boards: ICode[] = [];
    statuses: ICode[] = [];
    boardCode: string;
    boardItems: IItem[] = [];

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
    model: IItem;

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
        let prArray = [] as any;
        prArray.push(this.fetchAllItems());
        prArray.push(this.fetchAllCodes());
        prArray.push(this.fetchAllUsers());
        Promise.all(prArray).then((values) => {
            this.boards = this.codes.filter((x) => x.codetype === (ECodeType.Board as string));
            this.statuses = this.codes.filter((x) => x.codetype === (ECodeType.Status as string));
            this.boardCode = this.boards[0].code;
            this.loadBoardItems();
            this.loading = false;
            this.cdRef.detectChanges();
        });
    }

    ngOnChanges(): void {}

    ngAfterViewInit(): void {}

    loadBoardItems() {
        this.boardItems = this.items.filter((x) => x.boardcode === this.boardCode);
    }

    fetchAllItems(): Promise<any> {
        return this.itemService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.items = resp.sort((a, b) =>
                    a.boardcode < b.boardcode
                        ? -1
                        : a.boardcode > b.boardcode
                        ? 1
                        : a.disporder < b.disporder
                        ? -1
                        : a.disporder > b.disporder
                        ? 1
                        : 0
                );
                return true;
            });
    }

    fetchAllCodes(): Promise<any> {
        return this.codeService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.codes = resp;
                return true;
            });
    }

    fetchAllUsers(): Promise<any> {
        return this.userService
            .getAll()
            .toPromise()
            .then((resp) => {
                this.users = resp.sort((a, b) => (a.username > b.username ? 1 : -1));
                // this.loadSelectUsers('assignedtouser');
                return true;
            });
    }

    onBoardChange() {
        alert('board change  >> ' + this.boardCode);
    }

    handleReload(ev) {
        this.fetchAllItems().then((resp) => {
            this.loadBoardItems();
            this.cdRef.detectChanges();
        });
    }

    getBoardItems(status) {
        return this.boardItems.filter((x) => x.statuscode === status);
    }

    onEditRow(editBtn): void {
        editBtn.setAttribute('data-target', '#edit_' + this.model.id);
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

        this.itemService.updateItem(this.model).toPromise();
        this.toastr.success('Updated Ok!', 'Item', {
            timeOut: 3000,
        });

        closeButton.click();

        return true;
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

    trackByItemId1(index: number, item: any): number {
        return item.id;
    }
    trackByItemId2(index: number, item: any): number {
        return item.id;
    }
    trackByItemId3(index: number, item: any): number {
        return item.id;
    }
    trackByItemId4(index: number, item: any): number {
        return item.id;
    }
}

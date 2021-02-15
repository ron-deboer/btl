import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ECodeType, ICode } from 'src/app/_interfaces/code';
import { IItem } from 'src/app/_interfaces/item';
import { IUser } from 'src/app/_interfaces/user';
import { CodeService } from 'src/app/_services/code.service';
import { ItemService } from 'src/app/_services/item.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() item: IItem;
    @Output() itemUpdated = new EventEmitter();

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

    loading = true;
    model: IItem;
    codes: ICode[] = [];
    users: IUser[] = [];

    constructor(
        private itemService: ItemService,
        private codeService: CodeService,
        private userService: UserService,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.model = Object.assign({}, this.item);
        let prArray = [] as any;
        prArray.push(this.fetchAllCodes());
        prArray.push(this.fetchAllUsers());

        Promise.all(prArray).then((values) => {
            this.loading = false;
            this.cdRef.detectChanges();
        });
    }

    ngOnChanges(): void {}

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
        this.ITEM_CRUD_SPEC[key].source = this.codes
            .filter((x) => x.codetype === codeType)
            .map((x) => x.code);
    }

    loadSelectUsers(key) {
        this.ITEM_CRUD_SPEC[key].source = this.users.map((x) => x.username);
    }

    getCodeClass(codetype, code): string {
        const c = code.toLowerCase();
        if (codetype === 'user') {
            return 'badge-primary';
        }
        if (codetype === 'size') {
            if (c === 'large') {
                return 'badge-danger';
            }
            if (c === 'medium') {
                return 'badge-warning';
            }
            return 'badge-success';
        }
        if (codetype !== 'status') {
            if (c === 'high') {
                return 'badge-danger';
            }
            if (c === 'medium') {
                return 'badge-warning';
            }
            return 'badge-success';
        }
        if (c === 'open') {
            return 'badge-danger';
        }
        if (c !== 'closed') {
            return 'badge-warning';
        }
        return 'badge-success';
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
        this.reloadParent();

        return true;
    }

    reloadParent() {
        this.itemUpdated.emit({});
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

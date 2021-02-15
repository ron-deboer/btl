import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { isNumeric } from '../_helpers/utils';
import { CodeService } from '../_services/code.service';
import { ToastrService } from 'ngx-toastr';
import { ECodeType, ICode } from '../_interfaces/code';

@Component({
    selector: 'app-codes',
    templateUrl: './codes.component.html',
    styleUrls: ['./codes.component.scss'],
})
export class CodesComponent implements OnInit, AfterViewInit {
    loading = true;
    codes: ICode[] = [];
    model: ICode = null;
    CODE_CRUD_SPEC = {
        id: { type: 'text', default: 0 },
        codetype: { type: 'select', source: Object.values(ECodeType), default: '' },
        code: { type: 'text', default: '' },
        description: { type: 'text', default: '' },
    };

    constructor(
        private codeService: CodeService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.fetchAllCodes().then((resp) => {
            this.codes = resp.sort((a, b) =>
                a.codetype < b.codetype ? -1 : a.codetype > b.codetype ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0
            );
            this.loading = false;
        });
    }

    fetchAllCodes(): Promise<any> {
        return this.codeService.getAll().toPromise();
    }

    timePipe() {
        return { transform: (value) => this.datePipe.transform(value, 'hh:mm') };
    }

    onSubmit(closeButton) {
        console.log(this.model);
        if (this.model.id > 0) {
            const idx = this.codes.findIndex((x) => x.id === this.model.id);
            this.codes[idx] = Object.assign({}, this.model);
            this.codeService.updateCode(this.model).toPromise();
        } else {
            this.model.id = this.codes.sort((a, b) => (a.id < b.id ? 1 : -1))[0].id + 2;
            this.codeService.insertCode(this.model).toPromise();
        }
        this.codes = Object.assign([], this.codes);

        this.toastr.success('Updated Ok!', 'Code', {
            timeOut: 3000,
        });
        closeButton.click();
    }

    onEditRow(idx: number): void {
        this.model = {} as ICode;
        if (idx === -1) {
            Object.keys(this.CODE_CRUD_SPEC).forEach((field) => {
                this.model[field] = this.CODE_CRUD_SPEC[field].default;
            });
            this.model.id = 0;
            return;
        }
        const dat = this.codes.find((x) => x.id === idx);
        Object.keys(this.CODE_CRUD_SPEC).forEach((field) => {
            this.model[field] = isNumeric(this.CODE_CRUD_SPEC[field].default) ? parseInt(dat[field], 10) : dat[field];
        });
    }
}

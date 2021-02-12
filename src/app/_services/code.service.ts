import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ICode } from '../_interfaces/code';

@Injectable({
    providedIn: 'root',
})
export class CodeService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<ICode[]> {
        return this.http
            .get<ICode[]>(`${environment.apiUrl}/code/getall`)
            .pipe(catchError((err) => of(<ICode[]>[])));
    }

    getById(id: number): Observable<ICode> {
        return this.http.get<ICode>(`${environment.apiUrl}/code/${id}`);
    }

    updateCode(data: ICode): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/code/update`, data);
    }

    insertCode(data: ICode): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/code/insert`, data);
    }
}

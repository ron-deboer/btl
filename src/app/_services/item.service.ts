import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IItem } from '../_interfaces/item';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<IItem[]> {
        return this.http
            .get<IItem[]>(`${environment.apiUrl}/item/getall`)
            .pipe(catchError((err) => of(<IItem[]>[])));
    }

    getById(id: number): Observable<IItem> {
        return this.http.get<IItem>(`${environment.apiUrl}/item/${id}`);
    }

    updateItem(data: IItem): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/item/update`, data);
    }

    insertItem(data: IItem): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/item/insert`, data);
    }
}

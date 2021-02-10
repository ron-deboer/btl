import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IUser } from '../_interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<IUser[]> {
        return this.http.get<IUser[]>(`${environment.apiUrl}/user/getall`).pipe(catchError((err) => of(<IUser[]>[])));
    }

    getById(id: number): Observable<IUser> {
        return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
    }

    updateUser(data: IUser): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/user/update`, data);
    }

    insertUser(data: IUser): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/user/insert`, data);
    }
}

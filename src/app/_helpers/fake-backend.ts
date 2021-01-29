import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { IUser, ERole } from '../_interfaces/user';
import { ICode, ECodeType } from '../_interfaces/code';

declare var alasql: any;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    users: IUser[] = [];
    codes: ICode[] = [];

    constructor() {
        let loader = new LoadData();
        this.users = loader.loadUsers();
        this.codes = loader.loadCodes();
        // this.items = loader.loadItems();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null).pipe(mergeMap(handleRoute)).pipe(materialize()).pipe(delay(500)).pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions
        function authenticate() {
            const { username, password } = body;
            const user = this.users.find((x) => x.username === username && x.password === password);
            if (!user) return error('Invalid credentials');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                token: `dummy-jwt-token.${user.id}`,
            });
        }

        function getUsers() {
            return ok(this.users);
        }

        function getUserById() {
            const user = this.users.find((x) => x.id === idFromUrl());
            return ok(user);
        }

        // util functions
        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true,
};

class LoadData {
    loadUsers(): IUser[] {
        let users: IUser[] = [
            {
                id: 1,
                username: 'admin',
                password: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                roles: [ERole.Admin, ERole.User],
            },
            {
                id: 2,
                username: 'user',
                password: 'user',
                firstName: 'Normal',
                lastName: 'User',
                roles: [ERole.User],
            },
        ];
        alasql(
            'CREATE TABLE users (id int, username string, password string, firstName string, lastName string, roles string)'
        );
        for (let i = 0; i < users.length; i++) {
            const { id, username, password, firstName, lastName, roles } = users[i];
            alasql(
                `INSERT INTO users VALUES (${id}, '${username}', '${password}', '${firstName}', '${lastName}', '${roles}')`
            );
        }
        const results = alasql('SELECT * FROM users');
        console.log(results);
        return results;
    }

    loadCodes(): ICode[] {
        let codes: ICode[] = [
            {
                id: 1,
                codeType: ECodeType.Priority,
                code: 'High',
                description: 'High Priority',
            },
            {
                id: 2,
                codeType: ECodeType.Priority,
                code: 'Medium',
                description: 'Medium Priority',
            },
            {
                id: 2,
                codeType: ECodeType.Priority,
                code: 'Low',
                description: 'Low Priority',
            },
        ];
        alasql('CREATE TABLE code (id int, codeType string, code string, description string)');
        for (let i = 0; i < codes.length; i++) {
            const { id, codeType, code, description } = codes[i];
            alasql(`INSERT INTO code VALUES (${id}, '${codeType}', '${code}', '${description}')`);
        }
        const results = alasql('SELECT * FROM code');
        console.log(results);
        return results;
    }
}

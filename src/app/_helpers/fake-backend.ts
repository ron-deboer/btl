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

import { FAKE_USERS, FAKE_CODES, FAKE_ITEMS } from './fake-data';

import * as CryptoJS from 'crypto-js';

declare var alasql: any;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor() {
        let loader = new LoadData();
        loader.loadUsers();
        loader.loadCodes();
        loader.loadItems();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(250))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.includes('/user/'):
                    return handleUserRoute(url, method);
                    break;
                case url.includes('/code/'):
                    return handleCodeRoute(url, method);
                    break;
                case url.includes('/item/'):
                    return handleItemRoute(url, method);
                    break;
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
                    break;
            }
        }

        // user route handler
        function handleUserRoute(url: string, method: string) {
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
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
        // code route handler
        function handleCodeRoute(url: string, method: string) {
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
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
        // item route handler
        function handleItemRoute(url: string, method: string) {
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
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
            const { dat } = body;
            let dec = CryptoJS.Rabbit.decrypt(dat, 'QprU5OzwntBSJFfo6b6XRByY8G8cQELn');
            const tmp = dec.toString(CryptoJS.enc.Utf8);
            const a = tmp.split('.');
            const results = alasql(
                `SELECT * FROM users WHERE username='${a[0]}' AND password='${a[1]}'`
            );
            if (results.length === 0) {
                return error('Invalid credentials');
            }
            const user = results[0];
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
    loadUsers(): void {
        alasql(
            'CREATE TABLE users (id int, username string, password string, firstName string, lastName string, roles string)'
        );
        for (let i = 0; i < FAKE_USERS.length; i++) {
            const { id, username, password, firstName, lastName, roles } = FAKE_USERS[i];
            alasql(
                `INSERT INTO users VALUES (${id}, '${username}', '${password}', '${firstName}', '${lastName}', '${roles}')`
            );
        }
        const result = alasql(`SELECT * FROM users`);
        console.log(result);
    }

    loadCodes(): void {
        alasql('CREATE TABLE code (id int, codeType string, code string, description string)');
        for (let i = 0; i < FAKE_CODES.length; i++) {
            const { id, codeType, code, description } = FAKE_CODES[i];
            alasql(`INSERT INTO code VALUES (${id}, '${codeType}', '${code}', '${description}')`);
        }
        const result = alasql(`SELECT * FROM code`);
        console.log(result);
    }

    loadItems(): void {
        alasql(`CREATE TABLE item (
            id int,
            projectCode string,
            priorityCode string,
            sizeCode string,
            statusCode string,
            createdByUser string,
            createdTimeStamp Date,
            assignedToUser string,
            assignedTimeStamp Date,
            closedByUser string,
            closedTimeStamp Date,
            description string,
            comments string   
        )`);
        for (let i = 0; i < FAKE_ITEMS.length; i++) {
            const {
                id,
                projectCode,
                priorityCode,
                sizeCode,
                statusCode,
                createdByUser,
                createdTimeStamp,
                assignedToUser,
                assignedTimeStamp,
                closedByUser,
                closedTimeStamp,
                description,
                comments,
            } = FAKE_ITEMS[i];
            alasql(`INSERT INTO item VALUES (
                ${id}, 
                '${projectCode}', 
                '${priorityCode}', 
                '${sizeCode}', 
                '${statusCode}', 
                '${createdByUser}', 
                '${createdTimeStamp}', 
                '${assignedToUser}', 
                '${assignedTimeStamp}', 
                '${closedByUser}', 
                '${closedTimeStamp}', 
                '${description}', 
                '${comments}'
            )`);
        }
        const result = alasql(`SELECT * FROM item`);
        console.log(result);
    }
}

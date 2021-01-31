﻿import { Injectable } from '@angular/core';
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

import { FAKE_USERS, FAKE_CODES } from './fake-data';

import * as CryptoJS from 'crypto-js';
declare var alasql: any;

let users: IUser[] = [];
let codes: ICode[] = [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor() {
        let loader = new LoadData();
        users = loader.loadUsers();
        codes = loader.loadCodes();
        // this.items = loader.loadItems();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.includes('/users/'):
                    return handleUserRoute(url, method);
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
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

        // route functions
        function authenticate() {
            const { dat } = body;
            let dec = CryptoJS.Rabbit.decrypt(dat, '12:30pmIsTime4Lunch!');
            const tmp = dec.toString(CryptoJS.enc.Utf8);
            const a = tmp.split('.');
            const user = users.find((x) => x.username === a[0] && x.password === a[1]);
            if (!user) {
                return error('Invalid credentials');
            }
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
        alasql(
            'CREATE TABLE users (id int, username string, password string, firstName string, lastName string, roles string)'
        );
        for (let i = 0; i < FAKE_USERS.length; i++) {
            const { id, username, password, firstName, lastName, roles } = FAKE_USERS[i];
            alasql(
                `INSERT INTO users VALUES (${id}, '${username}', '${password}', '${firstName}', '${lastName}', '${roles}')`
            );
        }
        const results = alasql('SELECT * FROM users');
        console.log(results);
        return results;
    }

    loadCodes(): ICode[] {
        alasql('CREATE TABLE code (id int, codeType string, code string, description string)');
        for (let i = 0; i < FAKE_CODES.length; i++) {
            const { id, codeType, code, description } = FAKE_CODES[i];
            alasql(`INSERT INTO code VALUES (${id}, '${codeType}', '${code}', '${description}')`);
        }
        const results = alasql('SELECT * FROM code');
        console.log(results);
        return results;
    }
}

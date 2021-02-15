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
import * as CryptoJS from 'crypto-js';
import { IUser } from '../_interfaces/user';
import { ICode } from '../_interfaces/code';

declare var alasql: any;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor() {}

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
        /**
         * user route handler
         */
        function handleUserRoute(url: string, method: string) {
            const dtype = 'users';
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
                    return authenticate(body.dat);
                    break;
                case url.endsWith('/update') && method === 'POST':
                    return doUpdate(body, dtype);
                    break;
                case url.endsWith('/insert') && method === 'POST':
                    return doInsert(body, dtype);
                    break;
                case url.endsWith('/getall') && method === 'GET':
                    return doGetAll(dtype);
                    break;
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return doGetById(dtype);
                    break;
                default:
                    return next.handle(request);
                    break;
            }
        }
        /**
         * authenticate user
         */
        function authenticate(dat: any) {
            let dec = CryptoJS.Rabbit.decrypt(dat, 'QprU5OzwntBSJFfo6b6XRByY8G8cQELn');
            const tmp = dec.toString(CryptoJS.enc.Utf8);
            const a = tmp.split('.');
            const results = alasql(
                `SELECT * FROM db.users WHERE username='${a[0]}' AND password='${a[1]}'`
            );
            if (results.length === 0) {
                return error('Invalid credentials');
            }
            const user = results[0];
            return ok({
                id: user.id,
                username: user.username,
                name: user.name,
                email: '',
                role: user.role,
                token: `dummy-jwt-token.${user.id}`,
            });
        }
        /**
         * update existing row
         */
        function doUpdate(dat: any, dtype: string) {
            let sql = `UPDATE db.${dtype} SET `;
            Object.keys(dat).forEach((fld) => {
                if (fld !== 'id') {
                    sql += `${fld}='${dat[fld]}', `;
                }
            });
            sql = sql.slice(0, -2) + ` WHERE id=${dat.id};`;
            // console.log('updatesql >>>', sql);
            const results = alasql(sql);
            return ok({});
        }
        /**
         * insert new row
         */
        function doInsert(dat: any, dtype: string) {
            let sql = `INSERT INTO db.${dtype} VALUES (${dat.id}, `;
            Object.keys(dat).forEach((fld) => {
                if (fld !== 'id') {
                    sql += `'${dat[fld]}', `;
                }
            });
            sql = sql.slice(0, -2) + `);`;
            console.log('insertsql >>>', sql);
            const results = alasql(sql);
            return ok({});
        }
        /**
         * get all users
         */
        function doGetAll(dtype: string) {
            const results = alasql(`SELECT * FROM db.${dtype}`);
            results.forEach((x) => {
                x.token = `dummy-jwt-token.${x.id}`;
            });
            return ok(results);
        }
        /**
         * get user by id
         */
        function doGetById(dtype: string) {
            const user = this.users.find((x) => x.id === idFromUrl());
            return ok(user);
        }
        /**
         * code route handler
         */
        function handleCodeRoute(url: string, method: string) {
            const dtype = 'code';
            switch (true) {
                case url.endsWith('/update') && method === 'POST':
                    return doUpdate(body, dtype);
                    break;
                case url.endsWith('/insert') && method === 'POST':
                    return doInsert(body, dtype);
                    break;
                case url.endsWith('/getall') && method === 'GET':
                    return doGetAll(dtype);
                    break;
                case url.match(/\/codes\/\d+$/) && method === 'GET':
                    return doGetById(dtype);
                    break;
                default:
                    return next.handle(request);
                    break;
            }
        }
        /**
         * item route handler
         */
        function handleItemRoute(url: string, method: string) {
            const dtype = 'item';
            switch (true) {
                case url.endsWith('/update') && method === 'POST':
                    return doUpdate(body, dtype);
                    break;
                case url.endsWith('/insert') && method === 'POST':
                    return doInsert(body, dtype);
                    break;
                case url.endsWith('/getall') && method === 'GET':
                    return doGetAll(dtype);
                    break;
                case url.match(/\/codes\/\d+$/) && method === 'GET':
                    return doGetById(dtype);
                    break;
                default:
                    return next.handle(request);
                    break;
            }
        }
        /**
         * util functions
         */
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
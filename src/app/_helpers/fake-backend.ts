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
import * as CryptoJS from 'crypto-js';

import { db, persistDb } from './fake-data';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
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
            let row = db.users.find((x) => x.username === a[0] && x.password === a[1]);
            if (row === undefined) {
                return error('Invalid credentials');
            }
            const user = row;
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
            let row = db[dtype].find((x) => x.id === dat.id);
            Object.keys(dat).forEach((fld) => {
                if (fld !== 'id') {
                    row[fld] = dat[fld];
                }
            });
            setTimeout(() => {
                persistDb();
            }, 250);
            return ok({});
        }
        /**
         * insert new row
         */
        function doInsert(dat: any, dtype: string) {
            db[dtype].push(dat);
            setTimeout(() => {
                persistDb();
            }, 250);
            return ok({});
        }
        /**
         * get all users
         */
        function doGetAll(dtype: string) {
            let results = db[dtype];
            return ok(results);
        }
        /**
         * get user by id
         */
        function doGetById(dtype: string) {
            const row = db[dtype].find((x) => x.id === idFromUrl());
            return ok(row);
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

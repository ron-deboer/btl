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

        // user route handler
        function handleUserRoute(url: string, method: string) {
            switch (true) {
                case url.endsWith('/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/getall') && method === 'GET':
                    return getAllUsers();
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
                    return getAllUsers();
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
                    return getAllUsers();
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
                name: user.name,
                email: '',
                role: user.role,
                token: `dummy-jwt-token.${user.id}`,
            });
        }

        function getAllUsers() {
            const results = alasql(`SELECT * FROM users`);
            results.forEach((x) => {
                x.token = `dummy-jwt-token.${x.id}`;
            });
            return ok(results);
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

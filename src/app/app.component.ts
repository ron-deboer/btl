import { Component, OnInit } from '@angular/core';

declare var alasql: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'testapp';
    ngOnInit() {
        sessionStorage.removeItem('user');
        alasql('CREATE DATABASE IF NOT EXISTS db');
        alasql('ATTACH DATABASE db');
    }
}

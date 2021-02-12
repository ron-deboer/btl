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
        alasql('CREATE localStorage DATABASE IF NOT EXISTS db');
        alasql('ATTACH localStorage DATABASE db');
    }
}

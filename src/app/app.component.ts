import { Component, OnInit } from '@angular/core';
import { FakeDataLoader } from './_helpers/fake-data';

declare var alasql: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'btl';
    ngOnInit() {
        // alasql('CREATE indexeddb DATABASE IF NOT EXISTS db');
        // alasql('ATTACH indexeddb DATABASE db');
        alasql(
            'CREATE localstorage DATABASE IF NOT EXISTS db;\
        ATTACH localstorage DATABASE db;\
        USE db;',
            [],
            function () {
                FakeDataLoader();
            }
        );
    }
}

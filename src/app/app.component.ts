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
        alasql('DROP localstorage DATABASE IF EXISTS db;', [], function () {
            console.log('loading fake data (1)...');
            alasql(
                'CREATE localstorage DATABASE IF NOT EXISTS db;ATTACH localstorage DATABASE db;',
                [],
                function () {
                    console.log('loading fake data (2)...');
                    FakeDataLoader();
                }
            );
        });
    }
}

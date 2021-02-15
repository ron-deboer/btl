import { Component, OnInit } from '@angular/core';

import { db, fetchDb, persistDb, FakeDataLoader } from './_helpers/fake-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'btl';
    ngOnInit() {
        FakeDataLoader();
        fetchDb();
    }
}

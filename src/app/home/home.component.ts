import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    users: BehaviorSubject<[]> = new BehaviorSubject([]);
    users$: Observable<[]> = this.users.asObservable();
    constructor() {}

    ngOnInit(): void {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => this.users.next(json));
    }

    onEditRow(idx: number): void {
        alert(idx);
    }
}

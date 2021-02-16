import { TestBed } from '@angular/core/testing';

import { MsgBusService } from './msgbus.service';

describe('MsgBusService', () => {
    let service: MsgBusService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MsgBusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

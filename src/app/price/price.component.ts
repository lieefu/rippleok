import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ChangeDetector, Markets, ExchgRate, RangeTime} from '../js/ripple-remote.js';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
    constructor(
        private ref: ChangeDetectorRef,
        private gv: GlobalVariable
    ) {
        ChangeDetector.ref = ref;
    }
    ngOnInit() {
    }
    markets = Markets;
    ExchgRate = ExchgRate;
    RangeTime = RangeTime;
}

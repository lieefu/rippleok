import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ngChangeDetector, Markets, ExchgRate, RangeTime,startGetPrice} from '../js/ripple-price.js';
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
        ngChangeDetector.ref = ref;
    }
    ngOnInit() {
      startGetPrice();
     }
    markets = Markets;
    ExchgRate = ExchgRate;
    RangeTime = RangeTime;
}

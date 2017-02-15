import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { GlobalVariable } from '../global-variable';
import * as ripgw from '../js/ripple-gateway.js';
@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent implements OnInit {
    ripgw = ripgw;
    pagesize=25;
    constructor(
        private ref: ChangeDetectorRef,
        private router: ActivatedRoute,
        private gv: GlobalVariable
    ) {
        ripgw.ngChangeDetector.ref = ref;
    }

    ngOnInit() {
        this.router.params.subscribe(params => {
            let args = params['args'];
            if (args !== "0") {
                ripgw.start(args);
            }
        });
    }
}

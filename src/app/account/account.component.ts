import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { GlobalVariable } from '../global-variable';
import * as account from '../js/ripple-account.js';
@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    account = account;
    constructor(
        private ref: ChangeDetectorRef,
        private router: ActivatedRoute,
        public gv: GlobalVariable
    ) {
        account.ngChangeDetector.ref = ref;
    }

    ngOnInit() {
        this.router.params.subscribe(params => {
            let args = params['args'];
            if (args !== "0") {
                account.start(args);
            }
        });
    }
}

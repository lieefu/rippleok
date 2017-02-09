import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
@Component({
    selector: 'app-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

    constructor(
        private router: ActivatedRoute
    ) { }
    ledgerindex;
    ngOnInit() {
        this.router.params.subscribe(params => {
            this.ledgerindex = params['args'];
        });
    }

}

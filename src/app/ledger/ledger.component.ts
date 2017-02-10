import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var $:any;//declare var jQuery:any
@Component({
    selector: 'app-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {
    constructor(
        private http: Http,
        private router: ActivatedRoute
    ) { }
    ledgerinfo;
    ngOnInit() {
      $("#dataLoading").show();
      $('#jsonraw').hide();
        this.router.params.subscribe(params => {
            let args = params['args'];
            if(args==="0") {
              $("#dataLoading").hide();
              return;
            }
            let url: string = `https://data.ripple.com/v2/ledgers/${args}?transactions=true&binary=false&expand=true`;  // URL to web api
             this.http.get(url)
                .toPromise()
                .then(response => {
                  $("#dataLoading").hide();
                  $('#jsonraw').show();
                  this.ledgerinfo=JSON.stringify(response.json(), undefined, 4)})
                .catch(this.handleError)
        });
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}

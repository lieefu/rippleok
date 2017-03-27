import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variable';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(public gv: GlobalVariable) { }

    ngOnInit() {}
    setlang(value) {
        console.log(value);
        this.gv.setlang(value);
        return false;
    }
}

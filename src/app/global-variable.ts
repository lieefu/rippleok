import { Injectable } from '@angular/core';
//实现全局变量，参考：https://github.com/J-Siu/ng2-simple-global
declare var getLang: any;
declare var saveLang: any;

@Injectable()
export class GlobalVariable {

    constructor() {
        this.lang = getLang();
    }
    lang = 0;
    getlang(): number {
        return this.lang;
    }
    setlang(value) {
        this.lang = value;
        saveLang(value);
    }

}

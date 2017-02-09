import { Injectable } from '@angular/core';
//实现全局变量，参考：https://github.com/J-Siu/ng2-simple-global
@Injectable()
export class GlobalVariable {

    constructor() { }
    lang=1;
}

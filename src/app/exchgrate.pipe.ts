import { Pipe, PipeTransform } from '@angular/core';
import {ExchgRate} from '../assets/js/ripple-remote.js';

@Pipe({
    name: 'exchgrate'
})
export class ExchgratePipe implements PipeTransform {

    transform(input, tocur: string, cur: string): number {
        if (cur == tocur) return input;
        if (cur == 'BTC') return 1 / input;
        if (tocur == 'USD') {
            if (ExchgRate[cur]) return input / ExchgRate[cur];
        } else {
            if (ExchgRate[cur]) return input * ExchgRate['CNY'] / ExchgRate[cur];
        }
        return input;
    }
}

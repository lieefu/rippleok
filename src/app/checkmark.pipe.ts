import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkmark'
})
export class CheckmarkPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? '\u2713' : '\u2718';
  }

}

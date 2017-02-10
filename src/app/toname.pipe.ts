import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toname'
})
export class TonamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value;
  }

}

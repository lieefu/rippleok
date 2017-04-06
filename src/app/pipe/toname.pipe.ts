import { Pipe, PipeTransform } from '@angular/core';
declare var account2name:any;
@Pipe({
  name: 'toname'
})
export class TonamePipe implements PipeTransform {

  transform(value: any): any {
    return account2name(value);;
  }

}

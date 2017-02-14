import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bracket'
})
export class BracketPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == "") return "";
      return "(" + value + ")";
  }

}

import { Pipe, PipeTransform } from '@angular/core';
declare var shortAccount:any;
declare var shortTX:any;
@Pipe({
  name: 'short'
})
export class ShortPipe implements PipeTransform {

  transform(value: any, arg0: string): any {
    if(arg0=="Account"){
      return shortAccount(value);
    }else if(arg0=="TX"){
      //console.log("TX",value);
      return shortTX(value);
    }
    return value;
  }

}

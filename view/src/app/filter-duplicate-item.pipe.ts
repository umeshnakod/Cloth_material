import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class FilterDuplicateItemPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    // console.log('===========',value)
    
    // Remove the duplicate elements (this will remove duplicates
    let uniqueArray = value.filter(function (el, index, array) { 
      console.log("1111111111",el)
      return array.filter((a,b) => el.indexOf(a) === b)
    });

  return uniqueArray;
  }

}

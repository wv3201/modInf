import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filterId',
  pure: false
})
export class FilterIdPipe implements PipeTransform {

  transform(items: any[], idPaciente : string, value: any): any[] {
    if(!items) return [];
    if(!value || value.length == 0) return items; 
    return items.filter(data=> data[idPaciente].toLowerCase().indexOf(value.toLowerCase()) !=-1);
  }

}

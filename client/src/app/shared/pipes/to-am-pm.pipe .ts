import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toAmPmPipe',
  standalone: true
})
export class ToAmPmPipe implements PipeTransform {

  transform(time: string): string {
    if (!time) return '';

    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;

    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  }

}


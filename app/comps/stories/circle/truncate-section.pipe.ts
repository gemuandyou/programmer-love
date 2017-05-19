/**
 * Created by Gemu on 2017/5/16.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'truncateSection'})
export class TruncateSectionPipe implements PipeTransform {
    transform(value: string): string {
        if (value.length > 38) {
            return value.substr(0, 38) + '...';
        }
        return value;
    }
}
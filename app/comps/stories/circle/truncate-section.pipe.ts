/**
 * Created by Gemu on 2017/5/16.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'truncateSection'})
export class TruncateSectionPipe implements PipeTransform {
    transform(value: string, param: any): string {
        if (param) { // 无图片故事块
            if (value.length > 100) {
                return value.substr(0, 100) + '...';
            }
        } else { // 有图片故事块
            if (value.length > 38) {
                return value.substr(0, 38) + '...';
            }
        }
        return value;
    }
}
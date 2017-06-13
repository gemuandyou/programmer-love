/**
 * Created by Gemu on 2017/6/13.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'decodeURI'})
export class DecodeURIPipe implements PipeTransform {
    transform(value: string, param: any): string {
        return decodeURI(value);
    }
}
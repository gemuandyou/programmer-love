/**
 * 瀑布流排版
 * Created by Gemu on 2017/5/18.
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[pinterest]'
})
export class PinterestDirective {

    constructor(private templateRef:TemplateRef<any>, private viewContainer:ViewContainerRef) {
    }

    @Input() set pinterest(index:number) {
        //if (!condition && !this.hasView) {
        //    this.viewContainer.createEmbeddedView(this.templateRef);
        //    this.hasView = true;
        //} else if (condition && this.hasView) {
        //    this.viewContainer.clear();
        //    this.hasView = false;
        //}
        console.log(this.templateRef.elementRef.nativeElement);
        this.viewContainer.createEmbeddedView(this.templateRef);
    }
}
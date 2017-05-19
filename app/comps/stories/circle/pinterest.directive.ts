/**
 * 瀑布流排版
 * Created by Gemu on 2017/5/18.
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {CircleComponent} from "./circle.component";

@Directive({
    selector: '[pinterest]'
})
export class PinterestDirective {

    constructor(private templateRef:TemplateRef<any>, private viewContainer:ViewContainerRef) {
    }

    @Input() set pinterest(index:number) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        CircleComponent.circleBlockRenderEv.emit(index);
    }
}
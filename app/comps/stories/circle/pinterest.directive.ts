/**
 * 瀑布流排版
 * Created by Gemu on 2017/5/18.
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {CircleComponent} from "./circle.component";
import {MineListComponent} from "../mine/list/list.component";

@Directive({
    selector: '[pinterest]'
})
export class PinterestDirective {

    constructor(private templateRef:TemplateRef<any>, private viewContainer:ViewContainerRef) {
    }

    @Input() set pinterest(indexAndComp:string) {
        let split = indexAndComp.split('-');
        this.viewContainer.createEmbeddedView(this.templateRef);
        switch(split[0]) {
            case 'circle':
                CircleComponent.circleBlockRenderEv.emit(split[1]);
                break;
        }
    }
}
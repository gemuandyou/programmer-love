/**
 * Created by Gemu on 2017/6/11.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ModalBoxComponent} from "./modalbox.component";

@NgModule({
    imports: [CommonModule],
    declarations: [
        ModalBoxComponent
    ],
    exports: [ModalBoxComponent]
})
export class ModalBoxModule {}
/**
 * Created by gemu on 1/25/17.
 */
import {NgModule} from "@angular/core";
import {NotesComponent} from "./notes.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RetractDirective} from "./retract.directive";
import {ModalBoxModule} from "../modalbox/modalbox.module";
import {DecodeURIPipe} from "./decodeuri.pipe";

@NgModule({
    imports: [CommonModule, FormsModule, ModalBoxModule],
    //entryComponents: [ModalBoxComponent], // 动态加载组件会用到
    declarations: [
        NotesComponent,
        RetractDirective,
        DecodeURIPipe
    ]
})
export class NotesModule {}
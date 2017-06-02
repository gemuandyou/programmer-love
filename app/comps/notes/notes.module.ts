/**
 * Created by gemu on 1/25/17.
 */
import {NgModule} from "@angular/core";
import {NotesComponent} from "./notes.component";
import {CommonModule} from "@angular/common";
import {ModalBoxComponent} from "../modalbox/modalbox.component";
import {FormsModule} from "@angular/forms";
import {RetractDirective} from "./retract.directive";
@NgModule({
    imports: [CommonModule, FormsModule],
    //entryComponents: [ModalBoxComponent], // 动态加载组件会用到
    declarations: [
        NotesComponent,
        ModalBoxComponent,
        RetractDirective
    ]
})
export class NotesModule {}
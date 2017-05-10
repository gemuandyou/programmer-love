/**
 * Created by gemu on 1/25/17.
 */
import {NgModule} from "@angular/core";
import {NotesComponent} from "./notes.component";
import {CommonModule} from "@angular/common";
import {ModalBoxComponent} from "../modalbox/modalbox.component";
import {FormsModule} from "@angular/forms";
@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        NotesComponent,
        ModalBoxComponent
    ]
})
export class NotesModule {}
/**
 * Created by gemu on 11/27/16.
 */
import {NgModule} from "@angular/core";
import {CharityRouterModule} from "./charity-routing.module";
import {CharityComponent} from "./charity.component";
import {EssayComponent} from "../essay/essay.component";
import {PassiveComponent} from "./passive/passive.component";
import {ActiveComponent} from "./active/active.component";
import {PassiveListComponent} from "./passive/list/list.component";
import {CommonModule} from "@angular/common";
import {NotesComponent} from "../notes/notes.component";
@NgModule({
    imports: [CharityRouterModule, CommonModule], // 如果使用ngFor等指令，需要引入CommonModule
    declarations: [
        CharityComponent,
        PassiveComponent,
        ActiveComponent,
        PassiveListComponent
    ]
})
export class CharityModule {}
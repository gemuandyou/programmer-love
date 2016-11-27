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
@NgModule({
    imports: [CharityRouterModule],
    declarations: [
        CharityComponent,
        EssayComponent,
        PassiveComponent,
        ActiveComponent,
        PassiveListComponent
    ]
})
export class CharityModule {}
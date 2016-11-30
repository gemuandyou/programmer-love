import {Routes, RouterModule} from "@angular/router";
import {PassiveComponent} from "./passive/passive.component";
import {ActiveComponent} from "./active/active.component";
import {NgModule} from "@angular/core";
import {CharityComponent} from "./charity.component";
import {PassiveListComponent} from "./passive/list/list.component";
/**
 * Created by gemu on 11/27/16.
 */
const routes: Routes = [
    {
        path: 'charity',
        component: CharityComponent,
        children: [
            {path: '', redirectTo: 'passive', pathMatch: 'full'},
            {
                path: 'passive', component: PassiveComponent, outlet: 'exhibition', children: [
                {path: '', redirectTo: 'list'},
                {path: 'list', component: PassiveListComponent}
            ]
            },
            {path: 'active', component: ActiveComponent, outlet: 'content'}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CharityRouterModule {
}
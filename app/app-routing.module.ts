import {Routes, RouterModule} from "@angular/router";
import {CharityComponent} from "./comps/charity/charity.component";
import {NgModule} from "@angular/core";
import {EssayComponent} from "./comps/essay/essay.component";
import {NotesComponent} from "./comps/notes/notes.component";
/**
 * Created by gemu on 11/26/16.
 */
const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'charity'},
    {path: 'charity', component: CharityComponent},
    {path: 'essay', component: EssayComponent},
    {path: 'notes', component: NotesComponent}
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouterModule {
}
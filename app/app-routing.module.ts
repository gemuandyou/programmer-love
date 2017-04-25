import {Routes, RouterModule} from "@angular/router";
import {CharityComponent} from "./comps/charity/charity.component";
import {NgModule} from "@angular/core";
import {EssayComponent} from "./comps/essay/essay.component";
import {NotesComponent} from "./comps/notes/notes.component";
import {MedicineComponent} from "./comps/medicine/medicine.component";
import {FreehandComponent} from "./comps/freehand/freehand.component";
/**
 * Created by gemu on 11/26/16.
 */
const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'charity'},
    {path: 'charity', component: CharityComponent},
    {path: 'notes', component: NotesComponent},
    {path: 'essay', component: EssayComponent},
    {path: 'medicine', component: MedicineComponent},
    {path: 'freehand', component: FreehandComponent}
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
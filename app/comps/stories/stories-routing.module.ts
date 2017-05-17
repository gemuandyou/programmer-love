import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {CircleComponent} from "./circle/circle.component";
import {MineComponent} from "./mine/mine.component";
import {StoriesComponent} from "./stories.component";
/**
 * Created by gemu on 11/26/16.
 */
const routes:Routes = [
    {
        path: 'stories',
        component: StoriesComponent,
        children: [
            //{path: '', pathMatch: 'full', redirectTo: 'circle'}, // 不可用
            {path: 'circle', component: CircleComponent},
            {path: 'mine', component: MineComponent}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoriesRouterModule {
}
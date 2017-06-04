import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {CircleComponent} from "./circle/circle.component";
import {MineComponent} from "./mine/mine.component";
import {StoriesComponent} from "./stories.component";
import {MineListComponent} from "./mine/list/list.component";
import {MineAddComponent} from "./mine/add/add.component";
import {MineInfoComponent} from "./mine/info/info.component";
import {DetailComponent} from "./detail/detail.component";
/**
 * Created by gemu on 11/26/16.
 */
const routes:Routes = [
    {
        path: 'stories',
        component: StoriesComponent,
        children: [
            {path: '', pathMatch: 'suffix', redirectTo: 'circle'}, // 不可用
            {path: 'circle', component: CircleComponent},
            {path: 'detail', component: DetailComponent},
            {
                path: 'mine', component: MineComponent,
                children: [
                    {path: '', redirectTo: 'list'},
                    {path: 'list', component: MineListComponent},
                    {path: 'add', component: MineAddComponent},
                    {path: 'info', component: MineInfoComponent}
                ]
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoriesRouterModule {
}
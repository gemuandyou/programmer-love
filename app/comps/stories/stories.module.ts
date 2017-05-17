/**
 * Created by Gemu on 2017/4/24.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StoriesComponent} from "./stories.component";
import {StoriesRouterModule} from "./stories-routing.module";
import {CircleComponent} from "./circle/circle.component";
import {MineComponent} from "./mine/mine.component";
@NgModule({
    imports: [CommonModule, StoriesRouterModule],
    declarations: [
        StoriesComponent,
        CircleComponent,
        MineComponent
    ]
})
export class StoriesModule {}
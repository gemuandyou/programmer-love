/**
 * Created by Gemu on 2017/4/24.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StoriesComponent} from "./stories.component";
import {StoriesRouterModule} from "./stories-routing.module";
import {CircleComponent} from "./circle/circle.component";
import {MineComponent} from "./mine/mine.component";
import {TruncateSectionPipe} from "./circle/truncate-section.pipe";
import {PinterestDirective} from "./circle/pinterest.directive";
import {MineListComponent} from "./mine/list/list.component";
import {MineAddComponent} from "./mine/add/add.component";
import {MineInfoComponent} from "./mine/info/info.component";
import {DetailComponent} from "./detail/detail.component";
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, StoriesRouterModule],
    declarations: [
        StoriesComponent,
        CircleComponent,
        TruncateSectionPipe,
        PinterestDirective,
        MineComponent,
        MineListComponent,
        MineAddComponent,
        MineInfoComponent,
        DetailComponent
    ]
})
export class StoriesModule {}
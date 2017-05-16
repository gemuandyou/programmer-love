/**
 * Created by Gemu on 2017/4/24.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/stories.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class StoriesComponent {

    isAutonym: boolean = true; // 是否是实名发布。否为匿名发布

    constructor(title: Title) {
        title.setTitle("故事会");
    }

    switchAutonym(isAutonym: boolean): void {
        this.isAutonym = isAutonym;
        // TODO 2017-5-16 17:50:30 刷新故事数据
    }
}
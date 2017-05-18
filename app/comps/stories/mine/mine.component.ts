/**
 * Created by Gemu on 2017/5/16.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/mine/mine.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class MineComponent {

    constructor(title: Title) {
        title.setTitle("故事-个人中心");
    }

}
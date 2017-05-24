/**
 * Created by Gemu on 2017/5/16.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/mine/info/info.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class MineInfoComponent {

    constructor(title: Title) {
        title.setTitle("我的信息");
    }

}
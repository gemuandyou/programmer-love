/**
 * Created by Gemu on 2017/5/16.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/mine/add/add.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class MineAddComponent {

    constructor(title: Title) {
        title.setTitle("添加故事");
    }

}
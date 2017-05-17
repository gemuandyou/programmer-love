/**
 * Created by Gemu on 2017/4/24.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/circle/circle.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class CircleComponent {

    constructor(title: Title) {
        title.setTitle("我们的故事");
    }

}
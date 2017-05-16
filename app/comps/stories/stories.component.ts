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
    constructor(title: Title) {
        title.setTitle("故事会");
    }
}
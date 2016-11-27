/**
 * Created by gemu on 11/27/16.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/essay/essay.html'
})
export class EssayComponent {
    constructor(title: Title) {
        title.setTitle("一些文章资讯");
    }
}
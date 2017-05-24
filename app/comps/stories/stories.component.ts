/**
 * Created by Gemu on 2017/4/24.
 */
import {Component} from "@angular/core";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/stories.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class StoriesComponent {

    constructor(title: Title, private router: Router) {
        title.setTitle("故事会");
        if (router.url.endsWith('/stories')) {
            this.router.navigate(['stories', 'circle']);
        }
    }
}
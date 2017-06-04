/**
 * Created by Gemu on 2017/4/24.
 */
import {Component, OnDestroy} from "@angular/core";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";

@Component({
    templateUrl: 'app/comps/stories/stories.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class StoriesComponent implements OnDestroy {

    constructor(title: Title, private router: Router) {
        title.setTitle("故事会");
        if (router.url.endsWith('/stories')) {
            this.router.navigate(['stories', 'circle']);
        }
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }
}
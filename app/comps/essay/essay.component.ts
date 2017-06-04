/**
 * Created by gemu on 11/27/16.
 */
import {Component, OnDestroy} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";
@Component({
    templateUrl: 'app/comps/essay/essay.html'
})
export class EssayComponent implements OnDestroy {
    constructor(title: Title) {
        title.setTitle("一些文章资讯");
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }
}